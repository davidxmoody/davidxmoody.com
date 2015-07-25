---
title: Vim auto-capitalisation
date: 2014-08-29
tags: vim, featured
---

Continuing in the same theme as my [last post](/better-vim-abbreviations/), I am going to write about another awesome Vim tip I found recently. That is: automatic capitalisation of the first letter of each sentence. 

Many word processors already include this. For some reason, Vim and other text editors don't usually have the option. I don't know why. I feel that a lot of unnecessary key-strokes are wasted on the shift keys. It also stresses the little fingers and twists the wrists.


## The scripts

There is surprisingly little information available about this. The only decent thing I've ever found has been [this superuser question/answer](http://superuser.com/questions/737130/automatically-capitalize-the-first-letter-of-sentence-in-vim). There are two answers, both of which I like:

```vim
for char in split('abcdefghijklmnopqrstuvwxyz', '\zs')
    exe printf("inoremap <expr> %s search('[.!?]\\_s\\+\\%%#', 'bcnw') ? '%s' : '%s'", char, toupper(char), char)
endfor
```

The above script creates insert mode mappings for every lower-case letter. It uses the `<expr>` option to evaluate an expression instead of mapping directly to another key. That expression then searches backwards to check for certain punctuation. It then returns either the original character or the upper-case version of the character if a match was found. 

I like it but I prefer the second answer:

```vim
augroup SENTENCES
    au!
    autocmd InsertCharPre * if search('\v(%^|[.!?]\_s)\_s*%#', 'bcnw') != 0 | let v:char = toupper(v:char) | endif
augroup END
```

Here, instead of creating mappings, an auto-command is used. It "listens" for characters to be inserted and intercepts them. It searches backwards for punctuation and converts the character to be inserted (`v:char`) to upper-case. The `augroup` and `au!` stuff is just for grouping and isn't terribly important.

If you want to bypass the script(s) and force a lower-case letter to be inserted, you can press Ctrl+V followed by the letter. 

## Customisation

I'll be the first to admit that my Vimscript isn't the best. Nevertheless, I still wanted to change a few things based on the way I type. I wanted to add a few more contexts in which letters get capitalised:

- Markdown list items
- YAML front matter titles
- New paragraphs (which happen to come after something that doesn't end in a punctuation mark)

Here is my tweaked script:

```vim
augroup SENTENCES
    au!
    autocmd InsertCharPre * if search('\v(%^|[.!?]\_s+|\_^\-\s|\_^title\:\s|\n\n)%#', 'bcnw') != 0 | let v:char = toupper(v:char) | endif
augroup END
```

It can be tricky to figure out what's going on in a regular expression like that. I think the [Vim documentation on patterns](http://vimdoc.sourceforge.net/htmldoc/pattern.html#pattern-overview) is pretty helpful. Here is a *very brief* summary of what's going on:

- `\v` means that the following pattern is "very magic" so not as many characters need to be escaped
- `%^` is the start of the file
- `[.!?]\_s+` is a punctuation mark followed by some whitespace which may or may not include newlines
- `\_^\-\s` is a dash at the start of a line followed by a whitespace character
- `\_^title\:\s` is "title: " at the start of a line
- `\n\n` matches two newlines
- `%#` matches the cursor position
- The `'b'` option means search backwards

*[Edit on 2014-09-29: I somehow forgot to add Markdown headers to the list of capitalisation contexts. I will leave that as an exercise for the reader.]*

## Putting it all together

Combining this with the rest of my configuration options gives the following section of my `.vimrc` file:

```vim
func! WordProcessorMode()
    " Load Markdown syntax highlighting but with custom hashtag support
    set filetype=mkd
    syn match htmlBoldItalic "#[-_a-zA-Z0-9]\+"

    " Other options
    set nonumber
    set wrap
    set linebreak
    set breakat=\ 
    set display=lastline
    set tabstop=4
    set softtabstop=4
    set shiftwidth=4
    set formatoptions=
    set spell spelllang=en_gb
    source ~/.vim/abbreviations.vim

    " Auto-capitalize script
    augroup SENTENCES
        au!
        autocmd InsertCharPre * if search('\v(%^|[.!?]\_s+|\_^\-\s|\_^title\:\s|\n\n)%#', 'bcnw') != 0 | let v:char = toupper(v:char) | endif
    augroup END
endfu

com! WP call WordProcessorMode()
au BufNewFile,BufRead *.mkd call WordProcessorMode()
au BufNewFile,BufRead *.md call WordProcessorMode()
au BufNewFile,BufRead diary-*.txt call WordProcessorMode()
```
