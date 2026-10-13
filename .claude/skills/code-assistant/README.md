# Code Assistant Skill

A comprehensive developer tool for refactoring, unit testing, and debugging code.

## Quick Start

Use any of these three commands:

```
/refactor <code>        # Improve code readability/efficiency
/test <code>            # Generate unit tests
/debug <code> <error>   # Diagnose and fix bugs
```

## Key Features

✅ **Multi-language support**: JavaScript, Python, Java, Go, C#, Ruby, PHP, Rust, and more
✅ **Flexible customization**: Choose frameworks, strictness levels, and styles
✅ **Framework guidance**: Includes specific best practices for Jest, PyTest, xUnit, etc.
✅ **Strictness levels for testing**: Relaxed, Moderate (default), or Strict

## Testing Strictness Levels

- **Relaxed**: Quick smoke tests (2-3 tests)
- **Moderate**: Production-ready coverage (6-8 tests, DEFAULT)
- **Strict**: Enterprise-grade (15+ tests with edge cases, performance, parameterization)

## Framework Reference

### JavaScript/TypeScript
- Jest (recommended), Mocha, Vitest

### Python
- pytest (recommended), unittest, nose2

### Java
- JUnit 5 (recommended), TestNG with Mockito

### Go
- Built-in testing with table-driven tests

### C#/.NET
- xUnit.net (recommended), NUnit with Moq

### And many more...

## Example Usage

```
/test
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Framework: Jest
Strictness: strict
```

See SKILL.md for complete documentation and framework guides.
