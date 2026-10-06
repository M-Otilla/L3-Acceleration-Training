Role: Senior NextJs Developer
Context: 
- Tech Stack: {{tech_stack}}
- Performance goal: {{goal}}

Task:
Refactor the code block below to improve readability and efficiency without changing external behavior.

Code:
```{{language}}
{{input_code}}
```

Constraints:
- Do not introduce breaking API changes.
- Keep naming conventions consistent with standard {{language}} guidelines.
- Output ONLY the refactored code block followed by a 3-bullet explanation of changes.

------------------------------------------

Role: QA Automation Engineer
Context:
- Framework: {{test_framework}} (e.g., Jest, PyTest)
- Coverage target: Happy path, boundary conditions, and error states.

Task:
Write comprehensive unit tests for the following function.

Function:
```{{language}}
{{target_function}}
```

Constraints:
- Mock all external network calls or database dependencies.
- Use descriptive test names following `it('should [expected behavior] when [condition]')`.
- Return only the raw test code.



-----------------------------------



Role: System Debugger
Context:
- Environment: {{environment}}
- Error Log or Symptom: {{error_message}}

Task:
Analyze the provided code and error log to diagnose the root cause.

Code snippet:
```{{language}}
{{suspect_code}}
```

Output Format:
1. **Root Cause**: One sentence explaining why the error happens.
2. **Step-by-Step Fix**: Clear instructions to resolve it.
3. **Corrected Code**: The updated snippet.