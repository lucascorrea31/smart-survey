import {Request, Response} from 'express';
import {sanitizeRequest} from './sanitize-request';

describe('SanitizeRequest Tests', () => {
  let maliciousBodyJson: Object;
  let maliciousQueryJson: Object;
  let req: Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn();

  beforeEach(() => {
    mockNext.mockClear();
  });

  it('Should remove html and script tags from body and query string input', () => {
    const maliciousBodyString =
      'The <script>malicious();</script><div>code</div> <a>now</a> its ok';
    const cleanedBody = 'The code now its ok';
    const aliciousQueryString =
      '<script>malicious();</script><div>now its</div> ok';
    const cleanedQuery = 'now its ok';
    req = {
      body: maliciousBodyString,
      query: aliciousQueryString,
    } as unknown as Request;

    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(cleanedBody);
    expect(req.query).toEqual(cleanedQuery);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Should ignore a key called or include "password" on sanitize input', () => {
    const maliciousBodyJson = {
      password: '<a>this</a>will<div>pass</div>',
      passwordMatch: '<a>this</a>will<div>pass</div>',
      confirmPassword: '<a>this</a>will<div>pass</div>',
      passwordRepeat: '<a>this</a>will<div>pass</div>',
      repeatPassword: '<a>this</a>will<div>pass</div>',
      repeat_password: '<a>this</a>will<div>pass</div>',
      secret: '<a>this</a>will<div>pass</div>',
      superSecret: '<a>this</a>will<div>pass</div>',
      anyToken: '<a>this</a>will<div>pass</div>',
      token: '<a>this</a>will<div>pass</div>',
      tokenize: '<a>this</a>will<div>pass</div>',
      name: '<a>this</a><div> not</div>',
      document: '<a>this</a><div> not</div>',
    };
    const cleanedBody = {
      password: '<a>this</a>will<div>pass</div>',
      passwordMatch: '<a>this</a>will<div>pass</div>',
      confirmPassword: '<a>this</a>will<div>pass</div>',
      passwordRepeat: '<a>this</a>will<div>pass</div>',
      repeatPassword: '<a>this</a>will<div>pass</div>',
      repeat_password: '<a>this</a>will<div>pass</div>',
      secret: '<a>this</a>will<div>pass</div>',
      superSecret: '<a>this</a>will<div>pass</div>',
      anyToken: '<a>this</a>will<div>pass</div>',
      token: '<a>this</a>will<div>pass</div>',
      tokenize: '<a>this</a>will<div>pass</div>',
      name: 'this not',
      document: 'this not',
    };
    const aliciousQueryString =
      '<script>malicious();</script><div>now its</div> ok';
    const cleanedQuery = 'now its ok';
    req = {
      body: maliciousBodyJson,
      query: aliciousQueryString,
    } as unknown as Request;

    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(cleanedBody);
    expect(req.query).toEqual(cleanedQuery);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Should remove html and script tags from body and query json input', () => {
    maliciousQueryJson = {
      query: '<script>malicious();</script><div>thats</div> ok',
    };
    maliciousBodyJson = {
      name: '<script>somemaliciousscript();</script><div onclick="maliciousscript();">Hello, click me! </div> thats ok',
      email: "<img src='x' onerror='alert(\"XSS\")'>",
      bio: "<div><h1>Title</h1><p>Paragraph with <a href='http://example.com'>link</a> and <span style='color:red;'>inline style</span></p></div>",
      profile: {
        username: "<iframe src='javascript:alert(1)'></iframe>",
        avatar:
          "<svg onload=alert('XSS')><circle cx='50' cy='50' r='40' /></svg>",
      },
      numbers: [123, 456],
      isAdmin: true,
      description: 'Hello <b>world</b> <marquee>this is a marquee</marquee>',
      nested: {
        level1: {
          level2: "<form><input type='text'></form>",
          script: "<img src='x' onerror='alert(\"XSS\")'>",
        },
      },
    };
    req = {
      body: maliciousBodyJson,
      query: maliciousQueryJson,
    } as unknown as Request;

    const cleanedBody = {
      name: 'Hello, click me!  thats ok',
      email: '',
      bio: 'TitleParagraph with link and inline style',
      profile: {
        username: '',
        avatar: '',
      },
      numbers: [123, 456],
      isAdmin: true,
      description: 'Hello world this is a marquee',
      nested: {
        level1: {
          level2: '',
          script: '',
        },
      },
    };
    const cleanedQuery = {
      query: 'thats ok',
    };
    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(cleanedBody);
    expect(req.query).toEqual(cleanedQuery);
    expect(mockNext).toHaveBeenCalled();
  });

  it('Should remove html and script tags from body string input with invalid tag', () => {
    const maliciousBodyString = '<iframe src=%(scriptlet)s <';
    const cleanedBody = '';
    req = {
      body: maliciousBodyString,
    } as unknown as Request;
    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(cleanedBody);
  });

  it('Should return the same payload because it is neither a string nor object', () => {
    const bodyNumber = 123;
    req = {
      body: bodyNumber,
    } as unknown as Request;

    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(bodyNumber);
  });

  it('should skip types different of string and object inside a json object', () => {
    maliciousQueryJson = {
      query: '<script>malicious();</script><div>thats</div> ok',
    };

    const decimal = Number('6.55000000');
    const hex = 0xf00d;
    const binary = 0b1010;
    const octal = 0o744;
    const booleanType = true;
    const stringType =
      "<div><h1>Some</h1><p>string to be <a href='http://example.com'>sanitized</a> and <span style='color:red;'>cleaned</span></p></div>";
    const stringTypeCleaned = 'Somestring to be sanitized and cleaned';
    const tupleStringNumber = [stringType, decimal, hex];
    const arrayString = [stringType, stringType];
    const arrayNumber = [hex, binary, octal];
    const nullType = null;
    maliciousBodyJson = {
      decimal,
      nullType,
      hex,
      arrayString,
      arrayNumber,
      binary,
      octal,
      booleanType,
      stringType,
      tupleStringNumber,
      objectWithStringAndNumber: {
        stringType,
        decimal,
        hex,
        oneMoreLevel: {
          booleanType,
          tupleStringNumber,
          decimal,
          hex,
          binary,
          nullType,
          octal,
          stringType,
          oneMoreLevel2: {
            booleanType,
            decimal,
            arrayString,
            arrayNumber,
            hex,
            binary,
            octal,
            stringType,
            oneMoreLevel3: {
              booleanType,
              decimal,
              arrayString,
              arrayNumber,
              hex,
              binary,
              octal,
              stringType,
            },
          },
        },
      },
    };
    req = {
      body: maliciousBodyJson,
      query: maliciousQueryJson,
    } as unknown as Request;

    const cleanedBody = {
      decimal,
      nullType,
      hex,
      arrayString,
      arrayNumber,
      binary,
      octal,
      booleanType,
      stringType: stringTypeCleaned,
      tupleStringNumber,
      objectWithStringAndNumber: {
        stringType: stringTypeCleaned,
        decimal,
        hex,
        oneMoreLevel: {
          booleanType,
          tupleStringNumber,
          decimal,
          hex,
          binary,
          nullType,
          octal,
          stringType: stringTypeCleaned,
          oneMoreLevel2: {
            booleanType,
            decimal,
            arrayString,
            arrayNumber,
            hex,
            binary,
            octal,
            stringType: stringTypeCleaned,
            oneMoreLevel3: {
              booleanType,
              decimal,
              arrayString,
              arrayNumber,
              hex,
              binary,
              octal,
              stringType: stringTypeCleaned,
            },
          },
        },
      },
    };
    const cleanedQuery = {
      query: 'thats ok',
    };
    sanitizeRequest(req, res, mockNext);
    expect(req.body).toEqual(cleanedBody);
    expect(req.query).toEqual(cleanedQuery);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should sanitize an array req.body containing HTML and JS', () => {
    req.body = [
      {
        name: '<script>alert("hack")</script>',
        age: 25,
      },
      {
        name: '<script>alert("hack2")</script><div>Hello </div>John',
        age: 50,
      },
    ];
    sanitizeRequest(req as Request, res, mockNext);
    expect(req.body).toEqual([
      {
        name: '',
        age: 25,
      },
      {
        name: 'Hello John',
        age: 50,
      },
    ]);
    expect(mockNext).toHaveBeenCalled();
  });
});
