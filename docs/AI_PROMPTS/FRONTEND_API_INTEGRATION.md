You are working on an EXISTING production project.

IMPORTANT:
Do NOT create a new architecture.
Do NOT change the existing project structure.
Do NOT change the UI design.
Do NOT introduce a different coding style.
Follow the existing codebase exactly.

--------------------------------------------------
OBJECTIVE
--------------------------------------------------

Integrate a new backend API into the existing frontend application.

The backend API is already developed.

I will provide:

1. API Endpoint
2. Request Method
3. Request Body
4. Headers
5. Sample Success Response
6. Sample Error Response
7. Existing screen/page where integration is required
8. Existing component name
9. Existing service location
10. Any business rules

Use only the provided information.

--------------------------------------------------
PROJECT RULES
--------------------------------------------------

Follow the existing project architecture.

Do NOT modify unrelated files.

Reuse existing:

• API service pattern
• Axios/fetch wrapper
• Authentication handling
• Loader component
• Toast/Alert component
• Validation pattern
• Form components
• Utility functions
• Error handling
• Constants
• Environment variables

If similar API implementation already exists, reuse the same implementation style.

--------------------------------------------------
UI REQUIREMENTS
--------------------------------------------------

The UI already exists.

Maintain EXACTLY the existing:

• Fonts
• Font size
• Font weight
• Colors
• Theme
• Border radius
• Button style
• Icons
• Margins
• Padding
• Grid
• Card design
• Form alignment
• Responsive behavior
• Dark/light mode support (if available)

Do NOT redesign anything.

The newly integrated functionality must look exactly like the existing application.

--------------------------------------------------
CODING STANDARD
--------------------------------------------------

Follow the project's coding style.

Use:

• Existing naming convention
• Existing folder structure
• Existing import style
• Existing state management
• Existing hooks
• Existing API services
• Existing reusable components

Keep code clean.

Avoid duplication.

Write readable code.

--------------------------------------------------
API IMPLEMENTATION
--------------------------------------------------

Create only the required code.

Integrate:

Request

↓

Loading State

↓

API Call

↓

Success Handling

↓

Error Handling

↓

UI Update

↓

Validation

↓

Navigation (if required)

Handle:

• 200
• 201
• 400
• 401
• 403
• 404
• 409
• 422
• 500
• Network Failure
• Timeout

Use the project's existing error handling mechanism.

--------------------------------------------------
VALIDATION
--------------------------------------------------

Use existing validation library.

Show validation messages exactly like other forms.

Do not create a different validation style.

--------------------------------------------------
LOADER
--------------------------------------------------

Use the existing loader/spinner.

Do not create another loader.

--------------------------------------------------
TOAST / ALERT
--------------------------------------------------

Use existing toast/snackbar/dialog component.

Success and error messages should follow the existing application pattern.

--------------------------------------------------
CODE CHANGES
--------------------------------------------------

Before writing code:

1. Identify every file that requires modification.

2. Explain WHY each file needs changes.

3. Explain the implementation approach.

Do NOT immediately generate code.

Wait for my approval.

--------------------------------------------------
AFTER APPROVAL
--------------------------------------------------

Generate code file by file.

For every file:

Show:

File Name

Purpose

Changes

Complete Updated Code

Do not skip unchanged sections if the file is small.

For larger files, modify only the necessary portions while preserving all existing functionality.

--------------------------------------------------
QUALITY CHECK
--------------------------------------------------

Before finishing verify:

✓ No UI changes
✓ Existing design preserved
✓ Existing color scheme preserved
✓ Existing font preserved
✓ Existing spacing preserved
✓ Existing coding standards followed
✓ Existing folder structure followed
✓ No duplicate code
✓ Reused existing utilities
✓ Proper validation
✓ Proper error handling
✓ Responsive behavior maintained
✓ Type safety maintained (TypeScript)
✓ No console.log statements
✓ No commented dead code
✓ No breaking changes

--------------------------------------------------
INPUT THAT I WILL PROVIDE
--------------------------------------------------

Feature Name:

Screen Name:

Component:

API Endpoint:

HTTP Method:

Headers:

Request Body:

Success Response:

Error Response:

Business Rules:

Files to Integrate:

Additional Notes:

--------------------------------------------------
OUTPUT FORMAT
--------------------------------------------------

1. Requirement Understanding

2. Files that need modification

3. Implementation Plan

4. Impact Analysis

5. Wait for my approval

After approval:

Generate production-ready code one file at a time.