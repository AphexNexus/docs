+++
title = "Test01"
weight = 20
type = "docs"
draft = "true"
description = '''
Test
'''
+++


```go {linenos=inline hl_lines=[3,"6-8"] style=native}
package main

import "fmt"

func main() {
    for i := 0; i < 3; i++ {
        fmt.Println("Value of i:", i)
    }
}
```
