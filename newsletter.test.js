"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");

const script = readFileSync(`${__dirname}/script.js`, "utf8");
const key = "la-tavola-newsletter-emails";

function setup(storage = new Map()) {
  const handlers = {};
  const inputHandlers = {};
  const input = { value: "", addEventListener: (name, handler) => { inputHandlers[name] = handler; } };
  const fieldset = { disabled: true };
  const status = { textContent: "" };
  const form = {
    querySelector: (selector) => selector === "fieldset" ? fieldset : input,
    addEventListener: (name, handler) => { handlers[name] = handler; },
    // Browser constraint validation is stubbed; syntax checking belongs to type=email.
    reportValidity: () => input.value !== "" && input.value.includes("@"),
    reset: () => { input.value = ""; },
  };
  const localStorage = {
    getItem: (name) => storage.get(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
  };
  vm.runInNewContext(script, {
    document: {
      querySelector: (selector) => selector === ".newsletter form" ? form : null,
      querySelectorAll: () => [],
      getElementById: (id) => id === "newsletter-status" ? status : null,
    },
    window: { localStorage },
  });
  return {
    storage, localStorage, input, inputHandlers, fieldset, form, status,
    submit(email) {
      input.value = email;
      let prevented = false;
      handlers.submit({ preventDefault() { prevented = true; } });
      assert.equal(prevented, true);
    },
  };
}

test("enables demo controls and saves a normalized address", () => {
  const demo = setup();
  assert.equal(demo.fieldset.disabled, false);
  assert.equal(demo.form.noValidate, true);
  demo.submit("  Test@Example.COM  ");
  assert.deepEqual(JSON.parse(demo.storage.get(key)), ["test@example.com"]);
  assert.match(demo.status.textContent, /No real subscription/);
  assert.equal(demo.input.value, "");
});

test("rejects repeated emails including case and whitespace variants", () => {
  const demo = setup();
  demo.submit("test@example.com");
  for (const email of ["test@example.com", "TEST@example.COM", "  test@example.com  "]) {
    demo.submit(email);
    assert.match(demo.status.textContent, /already registered/);
    assert.deepEqual(JSON.parse(demo.storage.get(key)), ["test@example.com"]);
  }
  demo.inputHandlers.input();
  assert.equal(demo.status.textContent, "");
  demo.submit("another@example.com");
  assert.equal(JSON.parse(demo.storage.get(key)).length, 2);
});

test("reads shared storage again for each page and submission", () => {
  const storage = new Map();
  const home = setup(storage);
  const menu = setup(storage);
  home.submit("test@example.com");
  menu.submit("TEST@example.com");
  assert.match(menu.status.textContent, /already registered/);
  setup(storage).submit("test@example.com");
  assert.equal(JSON.parse(storage.get(key)).length, 1);
  storage.set(key, JSON.stringify(["  Existing@Example.COM "]));
  home.submit("existing@example.com");
  assert.match(home.status.textContent, /already registered/);
});

test("does not save inputs that fail constraint validation", () => {
  const demo = setup();
  for (const email of ["", "   ", "invalid"]) demo.submit(email);
  assert.equal(demo.storage.has(key), false);
});

test("does not overwrite malformed storage or claim success", () => {
  for (const saved of ["not json", "null", "{}", "[42]"]) {
    const demo = setup(new Map([[key, saved]]));
    demo.submit("test@example.com");
    assert.match(demo.status.textContent, /was not saved/);
    assert.equal(demo.storage.get(key), saved);
    assert.equal(demo.input.value, "test@example.com");
  }
});

test("handles blocked reads and failed writes without success feedback", () => {
  for (const operation of ["getItem", "setItem"]) {
    const demo = setup();
    demo.localStorage[operation] = () => { throw new Error("Storage unavailable"); };
    demo.submit("test@example.com");
    assert.match(demo.status.textContent, /was not saved/);
    assert.equal(demo.storage.has(key), false);
    assert.equal(demo.input.value, "test@example.com");
  }
});

test("both pages include matching, progressively enabled newsletter markup", () => {
  const pages = ["index.html", "menu.html"].map((name) => readFileSync(`${__dirname}/${name}`, "utf8"));
  const newsletters = pages.map((page) => page.match(/<div class="newsletter">[\s\S]*?<\/noscript>/)[0]);
  assert.equal(newsletters[0], newsletters[1]);
  assert.match(newsletters[0], /<fieldset disabled>/);
  assert.match(newsletters[0], /type="email"[^>]* required/);
  assert.match(newsletters[0], /role="status"/);
  for (const page of pages) assert.match(page, /<script[^>]*src="script.js"[^>]*defer/);
});
