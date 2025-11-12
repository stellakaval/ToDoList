# Good vs Bad Prompting Examples for TODO List Demo

## Example 1: Vague vs Specific

### ❌ BAD: "Make it better"
**Why it's bad:** No context, no direction, completely ambiguous

### ✅ GOOD: "Add a feature to prioritize tasks by allowing users to mark items as 'high', 'medium', or 'low' priority. Display priority with colored badges next to each task (red for high, yellow for medium, green for low). Store priority in localStorage along with the task text."

---

## Example 2: Missing Context vs Providing Context

### ❌ BAD: "Add categories"
**Why it's bad:** Doesn't explain how categories should work, where they fit, or what the user experience should be

### ✅ GOOD: "Add a category system to the TODO list. When adding a task, users should be able to select a category from a dropdown (Work, Personal, Shopping, Other). Each task should display its category as a small colored tag. Categories should be stored in localStorage. If no category is selected, default to 'Other'."

---

## Example 3: Unclear Requirements vs Clear Requirements

### ❌ BAD: "Add dates"
**Why it's bad:** Doesn't specify what kind of dates, how they should be used, or what the UI should look like

### ✅ GOOD: "Add due date functionality to tasks. Include a date picker in the add task form. Display the due date next to each task in 'MM/DD/YYYY' format. Tasks with due dates in the past should be highlighted in red. Store due dates in localStorage as ISO strings."

---

## Example 4: Single Monolithic Request vs Broken Down Steps

### ❌ BAD: "Add search, filtering, sorting, and drag-and-drop reordering to the todo list"
**Why it's bad:** Too many features at once, hard to implement correctly, likely to miss details

### ✅ GOOD: "Add a search bar above the todo list that filters tasks in real-time as the user types. The search should be case-insensitive and match any part of the task text. When there are no matches, display 'No tasks found'."

---

## Example 5: No Examples vs With Examples

### ❌ BAD: "Add animations"
**Why it's bad:** Doesn't specify what kind of animations, when they should trigger, or what they should look like

### ✅ GOOD: "Add smooth animations to task interactions. When a task is added, it should fade in from the top (0.3s ease-in). When marked complete, it should smoothly transition to the completed state with a checkmark animation. When deleted, use the existing 'fall' animation but make it smoother (0.4s ease-out)."

---

## Example 6: Ambiguous Language vs Precise Language

### ❌ BAD: "Make it look nicer"
**Why it's bad:** Subjective, no specific design direction, doesn't explain what 'nicer' means

### ✅ GOOD: "Improve the visual design by adding a dark mode toggle. When dark mode is enabled, change the background to #1a1a2e, text to #eee, and task backgrounds to #16213e. Add a moon/sun icon button in the top-right corner to toggle between modes. Persist the preference in localStorage."

---

## Example 7: Missing Technical Details vs Complete Technical Spec

### ❌ BAD: "Add edit functionality"
**Why it's bad:** Doesn't explain how editing should work, what the UX should be, or how to save changes

### ✅ GOOD: "Add the ability to edit existing tasks. When a user double-clicks on a task's text, replace it with an input field pre-filled with the current text. When the user presses Enter or clicks outside the input, save the changes and update localStorage. If the input is empty when saving, show an alert and cancel the edit."

---

## Example 8: No Error Handling vs With Error Handling

### ❌ BAD: "Add task statistics"
**Why it's bad:** Doesn't specify what statistics, where to display them, or how to calculate them

### ✅ GOOD: "Add a statistics section above the todo list showing: total tasks, completed tasks, and remaining tasks. Update these numbers in real-time as tasks are added, completed, or deleted. Display them in a horizontal bar with labels. If there are no tasks, show 'No tasks yet' instead of statistics."

---

## Example 9: Assumes Knowledge vs Provides Context

### ❌ BAD: "Fix the bug"
**Why it's bad:** Doesn't describe what the bug is, how to reproduce it, or what the expected behavior should be

### ✅ GOOD: "Fix the localStorage persistence issue: when a task is marked as completed, the completion status is not saved to localStorage. When the page refreshes, completed tasks revert to incomplete. Update the code to save completion status to localStorage and restore it when the page loads."

---

## Example 10: No Constraints vs With Constraints

### ❌ BAD: "Add notifications"
**Why it's bad:** Doesn't specify what triggers notifications, what they should say, or browser compatibility requirements

### ✅ GOOD: "Add browser notifications for tasks with due dates. When a task's due date is today and it's not completed, show a notification at 9 AM (check once when the page loads). The notification should say 'You have tasks due today!' Use the browser's Notification API, and request permission on first use. Only show notifications if the browser supports them."

---

## Key Takeaways for Students

1. **Be Specific**: Instead of "make it better," describe exactly what needs to change
2. **Provide Context**: Explain the current state and what you want to achieve
3. **Break Down Complex Tasks**: One feature at a time with clear requirements
4. **Include Examples**: Show what the output should look like
5. **Specify Technical Details**: Mention data storage, UI elements, user interactions
6. **Consider Edge Cases**: What happens when there's no data? What if the user does X?
7. **Use Precise Language**: Avoid subjective terms like "nice" or "better"
8. **Include Constraints**: Browser compatibility, performance, accessibility requirements

