with open("conceito/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace in @media screen and (max-width: 991px)
old_1 = """  .horizontal-track {
    width: 100% !important;
    padding-left: var(--gap) !important;
    padding-right: var(--gap) !important;
    grid-column-gap: 3.5rem !important;
    grid-row-gap: 3.5rem !important;
    flex-flow: column !important;
    height: auto !important;
    transform: none !important;
  }"""

new_1 = """  .horizontal-track {
    /* Mobile horizontal pinning enabled */
  }"""

# Replace in @media screen and (max-width: 767px)
old_2 = """  .horizontal-track {
    width: 100% !important;
    flex-flow: column !important;
    height: auto !important;
    transform: none !important;
    padding-top: calc(var(--vh, 1vh) * 0);
    padding-bottom: calc(var(--gap) * 0);
  }"""

new_2 = """  .horizontal-track {
    /* Mobile horizontal pinning enabled */
    padding-top: calc(var(--vh, 1vh) * 0);
    padding-bottom: calc(var(--gap) * 0);
  }"""

if old_1 in css:
    css = css.replace(old_1, new_1, 1)
    print("SUCCESS: removed old_1")
else:
    print("FAIL: old_1 not found")

if old_2 in css:
    css = css.replace(old_2, new_2, 1)
    print("SUCCESS: removed old_2")
else:
    print("FAIL: old_2 not found")

with open("conceito/style.css", "w", encoding="utf-8") as f:
    f.write(css)
print("Finished updating conceito/style.css")
