import time
import json
import requests


def main():
    client   = json.loads(requests.get('http://localhost:8080/client/register').text)
    print(client)

    # client['public'] = '123'
    # client['public'] = '1' + client['public'][1:]

    captcha  = json.loads(requests.get('http://localhost:8080/captcha/new?public={}'.format(client['public'])).text)
    print(captcha)

    # client['public'] = '123'
    # client['public'] = '1' + client['public'][1:]
    # captcha['request'] = '123'
    # captcha['request'] = '1' + captcha['request'][1:]
    # captcha['answer'] = ''
    # time.sleep(9)

    response = json.loads(requests.post('http://localhost:8080/captcha/solve', data={'public': client['public'],
                                                                                     'request': captcha['request'],
                                                                                     'answer': captcha['answer']}).text)
    # client['secret'] = '123'
    # client['secret'] = '1' + client['public'][1:]
    # response['response'] = '123'
    # response['response'] = '1' + response['response'][1:]

    print(response)
    result   = json.loads(requests.get('http://localhost:8080/captcha/verify?secret={}&response={}'.format(client['secret'], response['response'])).text)
    print(result)

    # result   = json.loads(requests.get('http://localhost:8080/captcha/verify?secret={}&response={}'.format(client['secret'], response['response'])).text)
    # print(result)


if __name__ == '__main__':
    main()
