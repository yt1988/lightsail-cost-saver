#!/usr/bin/env node
// Regression tests for public/calc.js (the same code the page runs). Usage: node scripts/test-calc.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { calculate, buildLink, parseLink, toState, fromState } from "../public/calc.js";

const prices = JSON.parse(await readFile(new URL("../public/prices.json", import.meta.url), "utf8"));
const now = Date.parse("2026-10-26T06:00:00Z");
let failed = 0;
const test = (name, fn) => { try { fn(); console.log("ok  ", name); } catch (e) { failed++; console.error("FAIL", name, "\n     ", e.message); } };

const base = {
  month: "2026-10", region: "us-east-1", sizeGB: 1, ipv4: true, baseStart: "2026-10-01T00:00Z",
  usedGB: 3150, usedAt: "2026-10-26T06:00Z", trafficInstances: [{ count: 1, start: "2026-10-11T00:00Z" }]
};

test("actual usage: overage expected, add 2 traffic instances", () => {
  const r = calculate(base, prices, now);
  assert.equal(r.mode, "actual-usage");
  assert.equal(r.status, "overage-expected");
  assert.equal(r.allowanceGB, 3435.35);
  assert.equal(r.forecastGB, 3867.33);
  assert.equal(r.overageCost, 38.88);
  assert.equal(r.unavoidableOverageGB, 0);
  assert.equal(r.recommendation.addTrafficInstances, 2);
  assert.equal(r.recommendation.startingAt, "2026-10-26T06:00:00.000Z");
  assert.deepEqual(r.nextMonth, { trafficInstances: 1, monthlyCost: 12 });
});

test("full-month plan: 10000 GB needs 4 instances for the whole month", () => {
  const r = calculate({ month: "2026-10", region: "us-east-1", sizeGB: 1, forecastGB: 10000 }, prices, now);
  assert.equal(r.mode, "full-month-plan");
  assert.equal(r.usedGB, null);
  assert.equal(r.overageCost, 715.68);
  assert.equal(r.recommendation.addTrafficInstances, 4);
  assert.equal(r.recommendation.startingAt, null);
  assert.equal(r.recommendation.eachAddsGB, 2048);
  assert.equal(r.recommendation.resultingCost, 20);
});

test("over allowance: overage already incurred cannot be offset", () => {
  const r = calculate({ ...base, usedGB: 15000 }, prices, now);
  assert.equal(r.status, "over-allowance");
  assert.equal(r.unavoidableOverageGB, 11564.65);
  assert.ok(r.recommendation.resultingCost > r.unavoidableOverageGB * r.region.overagePerGB);
});

test("half-allowance region and a safe month", () => {
  const r = calculate({ month: "2026-10", region: "ap-south-1", sizeGB: 1, usedGB: 100, usedAt: "2026-10-26T06:00Z" }, prices, now);
  assert.equal(r.region.halfAllowance, true);
  assert.equal(r.allowanceGB, 1024);
  assert.equal(r.status, "safe");
  assert.equal(r.recommendation, null);
});

test("no data yet", () => {
  const r = calculate({ month: "2026-10" }, prices, now);
  assert.equal(r.status, "needs-input");
  assert.equal(r.nextMonth, null);
});

test("in + out are added up as usage", () => {
  const r = calculate({ ...base, usedGB: undefined, inGB: 150, outGB: 3000 }, prices, now);
  assert.equal(r.usedGB, 3150);
});

test("link round trip keeps the configuration", () => {
  const link = buildLink(base);
  assert.ok(link.startsWith("https://ls.1ms.dog/?region=us-east-1&size=1"));
  assert.ok(link.includes("nodes=1@2026-10-11T00:00Z"));
  const back = calculate({ month: "2026-10", ...parseLink(new URL(link).search) }, prices, now);
  assert.deepEqual(back, calculate(base, prices, now));
});

test("state round trip", () => {
  const s = toState(base, now);
  assert.deepEqual(toState(fromState(s), now), s);
});

test("prices.json covers every region with 8 bundles", () => {
  const ids = Object.keys(prices.regions);
  assert.equal(ids.length, 19);
  for (const id of ids) assert.equal(prices.regions[id].bundles.length, 8, id);
});

if (failed) { console.error(`\n${failed} test(s) failed`); process.exit(1); }
console.log("\nall tests passed");
