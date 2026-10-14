/**
 * Safe Mathematical Expression Evaluator
 * Strictly parses and computes mathematical formulas without using `eval()` or `Function()`.
 * Supports +, -, *, /, ^, parentheses, and safe functions: min, max, sqrt, abs, round, floor, ceil.
 */

type TokenType = 'NUMBER' | 'VARIABLE' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'FUNCTION';

interface Token {
  type: TokenType;
  value: string;
}

const SUPPORTED_FUNCTIONS = new Set(['min', 'max', 'sqrt', 'abs', 'round', 'floor', 'ceil']);

export function tokenizeFormula(expr: string): { tokens: Token[]; error?: string } {
  const tokens: Token[] = [];
  let i = 0;
  const str = expr.trim();

  while (i < str.length) {
    const ch = str[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(str[i + 1] || ''))) {
      let numStr = '';
      let hasDot = false;
      while (i < str.length && (/[0-9]/.test(str[i]) || (str[i] === '.' && !hasDot))) {
        if (str[i] === '.') hasDot = true;
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z_]/.test(ch)) {
      let idStr = '';
      while (i < str.length && /[a-zA-Z0-9_]/.test(str[i])) {
        idStr += str[i];
        i++;
      }
      const lower = idStr.toLowerCase();
      if (SUPPORTED_FUNCTIONS.has(lower)) {
        tokens.push({ type: 'FUNCTION', value: lower });
      } else {
        tokens.push({ type: 'VARIABLE', value: idStr });
      }
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^') {
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    return { tokens: [], error: `Unsupported character "${ch}" at index ${i}` };
  }

  return { tokens };
}

// Convert Infix tokens to Postfix (RPN) using Dijkstra's Shunting-yard algorithm
export function toPostfix(tokens: Token[]): { rpn: Token[]; error?: string } {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
  };

  const rightAssociative: Record<string, boolean> = {
    '^': true,
  };

  let prevToken: Token | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER' || token.type === 'VARIABLE') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'COMMA') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        return { rpn: [], error: 'Misplaced comma or mismatched parentheses.' };
      }
    } else if (token.type === 'OPERATOR') {
      // Handle unary minus: if at start or right after operator/lparen
      if (token.value === '-' && (!prevToken || prevToken.type === 'OPERATOR' || prevToken.type === 'LPAREN')) {
        // Synthesize unary zero subtraction (0 - x)
        outputQueue.push({ type: 'NUMBER', value: '0' });
      }

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OPERATOR') {
          const pCurrent = precedence[token.value] || 0;
          const pTop = precedence[top.value] || 0;
          const isRight = !!rightAssociative[token.value];

          if ((!isRight && pCurrent <= pTop) || (isRight && pCurrent < pTop)) {
            outputQueue.push(operatorStack.pop()!);
            continue;
          }
        }
        break;
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        return { rpn: [], error: 'Mismatched parentheses: missing opening parenthesis.' };
      }
      // Pop the '('
      operatorStack.pop();

      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
        outputQueue.push(operatorStack.pop()!);
      }
    }

    prevToken = token;
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      return { rpn: [], error: 'Mismatched parentheses.' };
    }
    outputQueue.push(top);
  }

  return { rpn: outputQueue };
}

export function evaluatePostfix(rpn: Token[], variables: Record<string, number>): { result: number; error?: string } {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'VARIABLE') {
      const val = variables[token.value] ?? variables[token.value.toLowerCase()];
      if (val === undefined || isNaN(val)) {
        return { result: 0, error: `Undefined variable "${token.value}"` };
      }
      stack.push(val);
    } else if (token.type === 'OPERATOR') {
      if (stack.length < 2) {
        return { result: 0, error: `Insufficient operands for operator "${token.value}"` };
      }
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (Math.abs(b) < 1e-12) {
            return { result: 0, error: 'Division by zero.' };
          }
          stack.push(a / b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          return { result: 0, error: `Unknown operator "${token.value}"` };
      }
    } else if (token.type === 'FUNCTION') {
      const fn = token.value.toLowerCase();
      if (fn === 'min' || fn === 'max') {
        if (stack.length < 2) return { result: 0, error: `${fn}() requires 2 arguments.` };
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(fn === 'min' ? Math.min(a, b) : Math.max(a, b));
      } else {
        if (stack.length < 1) return { result: 0, error: `${fn}() requires 1 argument.` };
        const a = stack.pop()!;
        switch (fn) {
          case 'sqrt':
            if (a < 0) return { result: 0, error: 'Cannot take square root of negative number.' };
            stack.push(Math.sqrt(a));
            break;
          case 'abs':
            stack.push(Math.abs(a));
            break;
          case 'round':
            stack.push(Math.round(a));
            break;
          case 'floor':
            stack.push(Math.floor(a));
            break;
          case 'ceil':
            stack.push(Math.ceil(a));
            break;
          default:
            return { result: 0, error: `Unsupported function "${fn}"` };
        }
      }
    }
  }

  if (stack.length !== 1) {
    return { result: 0, error: 'Malformed mathematical expression.' };
  }

  const finalValue = stack[0];
  if (!isFinite(finalValue) || isNaN(finalValue)) {
    return { result: 0, error: 'Result is undefined or out of mathematical bounds.' };
  }

  return { result: finalValue };
}

export function evaluateSafeFormula(expression: string, variables: Record<string, number>): {
  result: number;
  error?: string;
} {
  if (!expression || !expression.trim()) {
    return { result: 0, error: 'Empty formula expression.' };
  }

  const { tokens, error: tokenError } = tokenizeFormula(expression);
  if (tokenError) return { result: 0, error: tokenError };

  const { rpn, error: parseError } = toPostfix(tokens);
  if (parseError) return { result: 0, error: parseError };

  return evaluatePostfix(rpn, variables);
}
