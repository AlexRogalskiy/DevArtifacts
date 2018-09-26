importance: 5

---

# Зачем нужен Origin?

Как вы, наверняка, знаете, существует HTTP-заголовок `Referer`, в котором обычно указан адрес страницы, с которой инициирован запрос.

Например, при отправке `XMLHttpRequest` со страницы `http://javascript.ru/some/url` на `http://google.ru`, заголовки будут примерно такими:

```
Accept:*/*
Accept-Charset:windows-1251,utf-8;q=0.7,*;q=0.3
Accept-Encoding:gzip,deflate,sdch
Accept-Language:ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4
Connection:keep-alive
Host:google.ru
*!*
Origin:http://javascript.ru
Referer:http://javascript.ru/some/url
*/!*
```

Как видно, здесь присутствуют и `Referer` и `Origin`.

Итак, вопросы:

1. Зачем нужен `Origin`, если `Referer` содержит даже более полную информацию?
2. Может ли быть такое, что заголовка `Referer` нет или он неправильный?

