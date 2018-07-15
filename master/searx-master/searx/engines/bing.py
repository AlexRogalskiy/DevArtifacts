"""
 Bing (Web)

 @website     https://www.bing.com
 @provide-api yes (http://datamarket.azure.com/dataset/bing/search),
              max. 5000 query/month

 @using-api   no (because of query limit)
 @results     HTML (using search portal)
 @stable      no (HTML can change)
 @parse       url, title, content

 @todo        publishedDate
"""

from lxml import html
from searx.engines.xpath import extract_text
from searx.url_utils import urlencode
from searx.utils import match_language, gen_useragent

# engine dependent config
categories = ['general']
paging = True
language_support = True
supported_languages_url = 'https://www.bing.com/account/general'
language_aliases = {'zh-CN': 'zh-CHS', 'zh-TW': 'zh-CHT', 'zh-HK': 'zh-CHT'}

# search-url
base_url = 'https://www.bing.com/'
search_string = 'search?{query}&first={offset}'


# do search-request
def request(query, params):
    offset = (params['pageno'] - 1) * 10 + 1

    lang = match_language(params['language'], supported_languages, language_aliases)

    query = u'language:{} {}'.format(lang.split('-')[0].upper(), query.decode('utf-8')).encode('utf-8')

    search_path = search_string.format(
        query=urlencode({'q': query}),
        offset=offset)

    params['url'] = base_url + search_path

    params['headers']['User-Agent'] = gen_useragent('Windows NT 6.3; WOW64')

    return params


# get response from search-request
def response(resp):
    results = []

    dom = html.fromstring(resp.text)

    try:
        results.append({'number_of_results': int(dom.xpath('//span[@class="sb_count"]/text()')[0]
                                                 .split()[0].replace(',', ''))})
    except:
        pass

    # parse results
    for result in dom.xpath('//div[@class="sa_cc"]'):
        link = result.xpath('.//h3/a')[0]
        url = link.attrib.get('href')
        title = extract_text(link)
        content = extract_text(result.xpath('.//p'))

        # append result
        results.append({'url': url,
                        'title': title,
                        'content': content})

    # parse results again if nothing is found yet
    for result in dom.xpath('//li[@class="b_algo"]'):
        link = result.xpath('.//h2/a')[0]
        url = link.attrib.get('href')
        title = extract_text(link)
        content = extract_text(result.xpath('.//p'))

        # append result
        results.append({'url': url,
                        'title': title,
                        'content': content})

    # return results
    return results


# get supported languages from their site
def _fetch_supported_languages(resp):
    supported_languages = []
    dom = html.fromstring(resp.text)
    options = dom.xpath('//div[@id="limit-languages"]//input')
    for option in options:
        code = option.xpath('./@id')[0].replace('_', '-')
        if code == 'nb':
            code = 'no'
        supported_languages.append(code)

    return supported_languages
