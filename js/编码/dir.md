## js编码
> js内部统一使用Unicode字符集编码，可以直接打印，填充。
``` html
    <!-- utf-8编码 -->
    <div>&#x6211;&#x7684;</div>
    <script>
        const body = document.querySelector('body')
        // 统一Unicode 编码
        let myCode = `\u6211\u7684`
        body.append(myCode)
        console.log(myCode);
    </script>
```
    - 补充
``` js
    // 能够解析大于两位的code
    String.fromCodePoint(0x20BB7)

```

+ ASCII
> 美国将26个英文字母和常用符号，共127个编入了计算机，采用ascii，a：65，b：66等等方式
> 中国采用了gb2312将中文编入进去
> 日本将日文编入了Shift_JIS

+ 全球为了统一，采用了unicode 将所有国家的文字统一编入了。js可以直接使用，注入
    - utf-8   ->            -> json 也是utf-8格式
    - utf-16  ->    -> 都是unicode的不同存储方式（优化方面），utf-8最为常用 模块直接解析，注入好像不行
    - utf-32  -> 

+ [base64编码](https://wangdoc.com/javascript/types/string.html#base64-%E8%BD%AC%E7%A0%81)
> Base64 就是一种编码方法，可以将任意值转成 0～9、A～Z、a-z、+和/这64个字符组成的可打印字符。使用它的主要目的，不是为了加密，而是为了不出现特殊字符，简化程序的处理。