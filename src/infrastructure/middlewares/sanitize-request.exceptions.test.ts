import {Request, Response} from 'express';
import {sanitizeRequest} from './sanitize-request';
import {logger} from '../../shared/logger/logger';

jest.mock('../../shared/logger/logger', () => ({
  logger: {
    info: jest.fn(),
  },
}));
jest.mock('sanitize-html', () => ({
  __esModule: true,
  default: jest.fn(() => {
    throw new Error('teste error');
  }),
}));

describe('SanitizeRequest Exception flux Tests', () => {
  let maliciousBodyJson: Object;
  let maliciousQueryJson: Object;
  let req: Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn();

  it('Should remove html and script tags from body and query json input with invalid tag', () => {
    maliciousQueryJson = {
      query: '<script>malicious();</script><div>thats</div> ok',
    };
    maliciousBodyJson = {
      description: '<iframe src=%(scriptlet)s <',
      key: '10081202008',
      amount: 1,
      accountId: 'b73277e8-8ec3-4c3c-9c53-1c448e60090a',
    };
    req = {
      body: maliciousBodyJson,
      query: maliciousQueryJson,
    } as unknown as Request;

    sanitizeRequest(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid JSON',
    });
    expect(logger.info).toHaveBeenCalledWith(
      'Invalid JSON input: Malicious or malformed input detected on body or query params',
      expect.objectContaining({
        data: {
          request: req,
        },
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should response the request with error when the input was invalid because the script tag was not closed', () => {
    req.body = {
      name: '<script>alert("hack")<script> tag  was not closed and will broke the json.parse',
      age: 25,
    };

    sanitizeRequest(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid JSON',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
