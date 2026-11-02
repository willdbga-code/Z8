with open('conceito/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

target = """/* 2. Top Navigation Bar on Mobile */
@media screen and (max-width: 767px) {
  .nav {"""

repl = """/* 2. Top Navigation Bar on Mobile */
@media screen and (max-width: 767px) {
  /* Prevent center collision between Franquia and Z8 Logo */
  .btn-layout.is-nav a[href="#candidatar"].btn-w.is-nav,
  #btn-header-franquia {
    display: none !important;
  }
  .nav {"""

# Handle CRLF
target_crlf = target.replace('\n', '\r\n')
repl_crlf = repl.replace('\n', '\r\n')

if target in c:
    c = c.replace(target, repl)
    print("Replaced LF")
elif target_crlf in c:
    c = c.replace(target_crlf, repl_crlf)
    print("Replaced CRLF")
else:
    print("Target not found")

with open('conceito/style.css', 'w', encoding='utf-8') as f:
    f.write(c)
