# Security Specification & Test Suite

## 1. Data Invariants
- **Authentication**: Users must be authenticated to perform any read or write operation on their own records.
- **Ownership Isolation**: Every document in `/agents`, `/transactions`, `/invoices`, and `/x402Logs` must have `userId` equal to `request.auth.uid`.
- **Schema & Type Integrity**: String lengths, required fields, and numeric boundaries must be strictly validated.
- **Immutability**: `userId` and `id` fields cannot be altered on update.

## 2. Dirty Dozen Payloads (Rejection Vectors)
1. **Unauthenticated Read**: Attempt to query agents without `auth`.
2. **Cross-User Data Theft**: Attempt to fetch transactions where `userId != request.auth.uid`.
3. **Spoofed User ID Creation**: Attempt to set `userId` to another user's ID on agent creation.
4. **Oversized String Injection**: Attempt to create an agent with name > 100 chars.
5. **Negative Balance Mutation**: Attempt to set negative USDC balance.
6. **Ghost Field Mutation**: Attempt to add unauthorized admin fields during update.
7. **Path Variable ID Poisoning**: Attempt to use document ID longer than 128 chars.
8. **Invalid Enum Injection**: Attempt to set invoice status to `SuperPaid`.
9. **Missing Required Fields**: Attempt to create a transaction without `txHash`.
10. **Immutability Bypass**: Attempt to update `userId` on existing agent document.
11. **Blanket Read Request**: Attempt unconstrained read without `userId` scoping.
12. **Non-Numeric Fee Manipulation**: Attempt setting string as `costUsdc`.

## 3. Security Rule Assertions
- All 12 threat vectors return PERMISSION_DENIED.
