import AWS from "aws-sdk";
import aws4 from "aws4";
import axios from "axios";

const BUCKET_WRITE = "eba-va-s3-write-dev";

// function that parses data into task object
const taskData = (awsRequestId, awsUsername) => ({
  request_id: awsRequestId,
  task_type: "count_appear_object",
  task: {
    target_list: [
      {
        target_id: "id_0001",
        source_s3_uri_0001: `s3://${BUCKET_WRITE}/${awsUsername}/${awsRequestId}/video.mp4`,
      },
    ],
  },
});

// signed request for invoking API Gateway
function signRequest(request, credentials) {
  const signedRequest = aws4.sign(request, {
    accessKeyId: credentials.awsAccessKey,
    secretAccessKey: credentials.awsSecretKey,
  });

  if (!signedRequest) throw new Error("Signed request nt created");

  if (!signedRequest.headers)
    throw new Error("Signed request requires headers");

  delete signedRequest.headers["HOST"];
  delete signedRequest.headers["Content-Length"];
  delete signedRequest.body; //axios uses data property

  return signedRequest;
}

// create a new Masala request, and returns request ID
export async function getRequestId(credentials) {
  const request = {
    host: "0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com",
    method: "POST",
    url: "https://0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com/dev/requests",
    path: "/dev/requests",
  };

  const signedRequest = signRequest(request, credentials);

  return await axios(signedRequest);
}

// upload file to S3 bucket
export async function uploadToS3(awsRequestId, credentials, file) {
  if (!file) throw new Error("File is not uploaded");
  try {
    const s3 = new AWS.S3({
      accessKeyId: credentials.awsAccessKey,
      secretAccessKey: credentials.awsSecretKey,
      region: "ap-northeast-1",
    });

    const ext = file.name.split(".").at(-1);

    return await s3
      .putObject({
        Bucket: `${BUCKET_WRITE}/${credentials.awsUsername}/${awsRequestId}`,
        Key: `video.${ext}`,
        Body: file,
        ContentType: file.type,
      })
      .promise();
  } catch (e) {
    throw new Error(e);
  }
}

// invoke inference
export async function runTask(awsRequestId, credentials) {
  const data = taskData(awsRequestId, credentials.awsUsername);
  const request = {
    host: "0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com",
    method: "POST",
    url: "https://0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com/dev/tasks",
    path: "/dev/tasks",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    data: JSON.stringify(data),
  };

  const signedRequest = signRequest(request, credentials);

  return await axios(signedRequest);
}

// get status of inference
export async function getRequestStatus(awsRequestId, credentials) {
  const request = {
    host: "0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com",
    method: "GET",
    url: `https://0rhonjieaj.execute-api.ap-northeast-1.amazonaws.com/dev/requests/${awsRequestId}`,
    path: `/dev/requests/${awsRequestId}`,
  };

  const signedRequest = signRequest(request, credentials);

  return await axios(signedRequest);
}
