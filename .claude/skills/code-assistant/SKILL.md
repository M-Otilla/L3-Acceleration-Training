---
name: code-assistant
description: Code refactoring, unit testing, and debugging assistant. Use this skill when the user runs `/refactor`, `/test`, or `/debug` commands with code snippets. Triggers on direct code improvement requests—refactoring for readability/efficiency, writing comprehensive unit tests with mocked dependencies, or diagnosing bugs from error logs. Works with any programming language. Customize performance goals, test frameworks, environments, and external dependencies as needed.
---

# Code Assistant

A three-in-one developer tool for refactoring, testing, and debugging code. Use the appropriate command below for your task.

---

## Commands

### 1. `/refactor <code>`

Refactor code to improve readability and efficiency without changing external behavior.

**Input:**
- Code block (any language)
- Optional: Performance goal (e.g., "reduce memory usage", "improve readability", "optimize speed")
- Optional: Tech stack/framework context

**Output:**
- Refactored code block
- 3-bullet explanation of changes

**Constraints:**
- No breaking API changes
- Keep naming conventions consistent
- Preserve external behavior

**Example:**
```
/refactor
```javascript
const arr = [1, 2, 3, 4, 5];
let sum = 0;
for (let i = 0; i < arr.length; i++) {
  sum += arr[i];
}
```
Goal: Improve readability
```

---

### 2. `/test <code>`

Generate comprehensive unit tests for a function or code block.

**Input:**
- Function or code block (any language)
- Optional: Test framework (e.g., Jest, PyTest, Mocha, Go testing)
- Optional: Coverage targets (happy path, boundary conditions, error states)
- Optional: Strictness level (relaxed, moderate, strict)

**Output:**
- Raw test code (no explanations)
- Mocked external dependencies
- Descriptive test names following: `it('should [expected behavior] when [condition]')`

**Constraints:**
- Mock all external network calls and database dependencies
- Include happy path, boundary conditions, and error states
- Use descriptive test names

**Strictness Levels:**
- **Relaxed**: Basic happy path + 1-2 edge cases. Good for quick validation.
- **Moderate** (default): Happy path, boundary conditions, common error states. Balanced coverage.
- **Strict**: Comprehensive coverage—happy path, all edge cases, error states, integration scenarios, performance considerations. For production-critical code.

**Example:**
```
/test
```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```
Framework: Jest
Coverage: happy path, edge cases, errors
Strictness: moderate
```

---

### 3. `/debug <code> <error_message>`

Diagnose the root cause of an error and provide a fix.

**Input:**
- Code snippet (suspected problematic code)
- Error message or symptom description
- Optional: Environment context (Node.js, Python 3.11, browser, etc.)

**Output:**
1. **Root Cause**: One sentence explaining why the error happens
2. **Step-by-Step Fix**: Clear instructions to resolve it
3. **Corrected Code**: The updated snippet

**Example:**
```
/debug
```javascript
const data = JSON.parse(userInput);
```
Error: SyntaxError: Unexpected token in JSON at position 0
Environment: Node.js 18
```

---

## Framework & Language Guide

### JavaScript / TypeScript

**Test Frameworks:**
- **Jest** (most popular): Zero-config testing, built-in mocking, snapshots
  - Use: `describe()`, `it()`, `expect()`, `jest.mock()`
  - Strictness: Relaxed = basic tests, Moderate = edge cases + mocks, Strict = parameterized tests + coverage reporting
  
- **Mocha** (flexible): Requires additional assertion libraries (Chai, Should.js)
  - Use: `describe()`, `it()`, `chai.expect()`
  - Pairs well with Sinon for advanced mocking

- **Vitest** (modern): Vite-native, Jest-compatible, faster
  - Use: Same as Jest, drop-in replacement

**Refactoring Tips:**
- Use arrow functions and optional chaining
- Prefer `const` and `let` over `var`
- Use destructuring for cleaner code

**Debugging Tips:**
- Check for null/undefined with optional chaining (`?.`)
- Validate JSON with try/catch
- Use TypeScript for type safety

---

### Python

**Test Frameworks:**
- **pytest** (modern, recommended): Simple syntax, fixtures, parametrization
  - Use: `def test_*()`, `assert`, `@pytest.fixture`, `monkeypatch`
  - Strictness: Relaxed = basic assertions, Moderate = fixtures + mocking, Strict = parametrized tests + coverage

- **unittest** (standard library): Class-based, more verbose
  - Use: `class TestFoo(unittest.TestCase)`, `setUp()`, `assertEqual()`

- **nose2** (legacy): Based on unittest, less common now

**Mocking:**
- Use `unittest.mock` (standard) or `pytest-mock` (simpler)
- Mock external APIs with `@patch` decorator or `monkeypatch` fixture

**Refactoring Tips:**
- Use list comprehensions over loops
- Leverage f-strings for cleaner formatting
- Use type hints for clarity

**Debugging Tips:**
- Handle `KeyError` with `.get()` or try/except
- Use `isinstance()` for type checking
- Validate arguments at function entry

---

### Go

**Test Framework:**
- **Go testing** (built-in): `*testing.T` parameter, no external dependencies
  - Use: `func TestFoo(t *testing.T)`, `t.Errorf()`, `t.Fatal()`
  - Strictness: Relaxed = basic error checks, Moderate = table-driven tests, Strict = benchmarks + race detection

**Mocking:**
- Use interfaces for mockable dependencies
- Consider `testify/mock` for advanced scenarios

**Refactoring Tips:**
- Use interfaces for abstraction
- Prefer explicit error handling
- Use goroutines for concurrency

---

### Java

**Test Framework:**
- **JUnit 5** (modern): Annotations, parameterized tests, extensions
  - Use: `@Test`, `@BeforeEach`, `@ParameterizedTest`, `assertEquals()`
  
- **TestNG** (powerful): Better support for complex testing scenarios
  - Use: `@Test`, `@DataProvider`, `@BeforeMethod`

**Mocking:**
- Use **Mockito** (industry standard): `Mockito.mock()`, `when().thenReturn()`, `verify()`
- Alternative: **PowerMock** for static method mocking

**Refactoring Tips:**
- Use streams for functional operations
- Prefer immutability where possible
- Use builder pattern for complex objects

---

### C# / .NET

**Test Framework:**
- **xUnit.net** (modern, recommended): Clean syntax, fixtures
  - Use: `[Fact]`, `[Theory]`, `Assert.Equal()`
  
- **NUnit** (mature): Similar to JUnit
  - Use: `[Test]`, `[SetUp]`, `Assert.AreEqual()`

**Mocking:**
- Use **Moq**: `new Mock<IService>()`, `.Setup()`, `.Verify()`
- Alternative: **NSubstitute** for simpler syntax

**Refactoring Tips:**
- Use LINQ for querying
- Leverage async/await properly
- Use nullable reference types (C# 8+)

---

### Other Languages

**Ruby:** RSpec (behavior-driven testing), Minitest (lightweight)
**PHP:** PHPUnit (de facto standard), Pest (modern alternative)
**Rust:** Built-in test framework with `#[test]`, Criterion for benchmarks
**Swift:** XCTest (built-in), Quick + Nimble for BDD-style testing

---

## How to Use

1. **Choose your command**: refactor, test, or debug
2. **Provide your code**: Paste the code block you want to work with
3. **Add context** (optional): 
   - Tech stack or framework
   - Performance goals
   - Environment details
   - Test strictness level (for `/test`)
   - Constraints or preferences
4. **Get results**: Refactored code, tests, or debugging steps

---

## Customization Options

### For `/refactor`
- **Goal**: readability, performance, maintainability, or simplicity
- **Context**: Framework, library version, performance constraints
- **Style**: Functional vs. imperative, conciseness vs. verbosity

### For `/test`
- **Framework**: Jest, PyTest, Mocha, xUnit, etc. (auto-detected if not specified)
- **Strictness Level**:
  - **Relaxed**: Basic tests (happy path + 1 edge case) — for exploratory/prototype code
  - **Moderate**: Balanced coverage (happy path + boundaries + errors) — DEFAULT, suitable for most code
  - **Strict**: Comprehensive tests (all scenarios, edge cases, performance) — for production-critical, financial, or security code
- **Assertion Style**: BDD (`expect`) vs. classic (`assert`)
- **Coverage Focus**: Unit only, or include integration?

### For `/debug`
- **Environment**: Node.js version, Python version, browser, runtime details
- **Error Context**: Full stack trace or just the error message
- **Code Complexity**: Single function vs. multi-file issue

---

## Supported Languages

Works with any language including:
- **JavaScript / TypeScript** (Jest, Mocha, Vitest, Playwright)
- **Python** (pytest, unittest, nose2)
- **Java** (JUnit, TestNG, Mockito)
- **Go** (testing, table-driven tests)
- **C# / .NET** (xUnit, NUnit, Moq)
- **Ruby** (RSpec, Minitest)
- **PHP** (PHPUnit, Pest)
- **Rust** (built-in test framework, Criterion)
- **Swift** (XCTest, Quick)
- And more...

---

## Tips

- **For refactoring**: Specify your goal (readability vs. performance vs. maintainability) and mention any constraints
- **For testing**: Mention your preferred framework, coverage needs, and strictness level (default: moderate)
  - Relaxed = quick smoke tests, Moderate = production-ready coverage, Strict = critical systems
- **For debugging**: Include the full error message/stack trace and environment details for faster resolution
- **Multi-file context**: If your code depends on other files, briefly describe their role
- **Best practices**: Each framework section above includes language-specific tips for better test design
