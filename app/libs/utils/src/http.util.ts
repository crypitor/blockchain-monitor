export async function sendPost(
  url: string,
  body: any,
  authorization?: string,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
    body: JSON.stringify(body),
  });
  return response;
}

export async function sendGet(
  url: string,
  authorization?: string,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  });
  return response;
}

export async function sendDelete(
  url: string,
  authorization?: string,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
  });
  return response;
}

export async function sendPut(
  url: string,
  body: any,
  authorization?: string,
): Promise<Response> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
    },
    body: JSON.stringify(body),
  });
  return response;
}