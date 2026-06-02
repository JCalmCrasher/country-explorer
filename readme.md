# Country Explorer

## Objective

Build a web application that allows users to search for countries and view information about them using a public API.

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- No frameworks or libraries

---

## Styling Description

Your UI should feel like a simple modern web app. Focus on clarity and usability rather than decoration.

- Use a clean system font or simple Google Font
- Keep consistent spacing (padding and margins)
- Center the main app container on the page
- Use a card layout for displaying country results
- Buttons should have clear hover and active states
- Input field should be prominent and easy to use
- Use subtle borders or shadows to separate sections
- Ensure full responsiveness (mobile + desktop)
- Keep a consistent, minimal color palette (avoid excessive colors)
- Loading state: simple spinner or “Loading...” text, centered
- Error state: clear message in a noticeable but not harsh style (e.g. light red or warning tone)
- Empty state: neutral prompt like “Search for a country to begin”

---

## API

Use the REST Countries API:

```text
https://restcountries.com/v3.1/name/{country}j
```

Example:

```text
https://restcountries.com/v3.1/name/nigeria
```

---

## Features

### Search

- Country search input
- Search button
- Pressing Enter should trigger search

### Display

Display the following information:

- Country Flag
- Country Name
- Capital City
- Population
- Region
- Currency

### States

Handle:

- Empty State
- Loading State
- Error State

---

## UI Requirements

### Layout

```
+--------------------------------------------------+
|                 Country Explorer                 |
+--------------------------------------------------+

[ Search Country...                 ] [ Search ]

----------------------------------------------------

               (Country Card)

+----------------------------------------------+
|                    FLAG                      |
|                                               |
| Country: Nigeria                              |
| Capital: Abuja                                |
| Population: 223,804,632                       |
| Region: Africa                                |
| Currency: Nigerian Naira                      |
+----------------------------------------------+
```

For a more visual design please [see](./ui.png)

### Styling

- Mobile responsive
- Clean spacing
- Consistent typography
- Card-based layout
- Hover effect on button
- Loading and error messages clearly visible

---

## Bonus (Optional)

- Debounce search input
- Store recent searches in localStorage
- Display neighboring countries
- Click neighboring country to view details

---

## Submission

Submit:

1. Source code
2. README containing:
  - How to run the project
  - [Challenges faced](#challenges-faced)
  - [Improvements you'd make with more time](#future-improvements)
3. *if you must use ai, don't over rely ai on it, use it to debug, understand and/or explain concepts you're not familiar with.*

---

## Live Review

Be prepared to explain:rest

- How `fetch()` works
- Why you used `async/await`
- How errors are handled
- How API data is rendered
- Any assumptions you made

---

## Time Limit

Recommended completion time:

**3–5 hours**

Focus on clean code, good user experience, and proper handling of API responses.

### Reference UI

The final design does not need to match these exactly, but it should follow a similar clean, responsive card-based approach.

## Challenges faced

## Future Improvements


## Debugging mindset

If something is not showing:

Ask yourself:

1. Did the API return data?
2. Is my selector correct?
3. Did I actually render the result to the DOM?
4. Is the function even being called?

Use something like:

`console.log("step reached")`

---

## Fetch flow reminder

Typical flow should look like:

* get input value
* call API
* wait for response
* extract data
* update UI


## Important mindset

Don’t try to “write perfect code first”.

Instead:

* make it work first
* then improve structure
* then handle edge cases