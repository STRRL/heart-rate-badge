import {
  OAuth2Client,
  JWT,
  Compute,
  UserRefreshClient,
  BaseExternalAccountClient,
  GoogleAuth,
} from "googleapis-common";
import { fitness_v1 } from "googleapis/build/src/apis/fitness";
import { google } from "googleapis";

export async function listFitnessHeartRateDatasources(
  auth:
    | string
    | OAuth2Client
    | JWT
    | Compute
    | UserRefreshClient
    | BaseExternalAccountClient
    | GoogleAuth
) {
  const fitness = google.fitness("v1");
  return new Promise((resolve, reject) => {
    fitness.users.dataSources.list(
      {
        userId: "me",
        auth: auth,
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp!.data.dataSource);
        }
      }
    );
  });
}

export async function listFitnessHeartRateDatasets(
  auth:
    | string
    | OAuth2Client
    | JWT
    | Compute
    | UserRefreshClient
    | BaseExternalAccountClient
    | GoogleAuth,
  fromUnixNano: number,
  toUnixNano: number
): Promise<fitness_v1.Schema$Dataset> {
  const fitness = google.fitness("v1");
  return new Promise((resolve, reject) => {
    fitness.users.dataSources.datasets.get(
      {
        datasetId: `${fromUnixNano}-${toUnixNano}`,
        userId: "me",
        auth: auth,
        limit: 10,
        dataSourceId:
          "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
      },
      (err, resp) => {
        if (err) {
          reject(err);
        } else {
          resolve(resp!.data);
        }
      }
    );
  });
}

export async function latestHeartRate(
  auth:
    | string
    | OAuth2Client
    | JWT
    | Compute
    | UserRefreshClient
    | BaseExternalAccountClient
    | GoogleAuth,
  fromUnixNano: number,
  toUnixNano: number
) {
  const datasets = await listFitnessHeartRateDatasets(
    auth,
    fromUnixNano,
    toUnixNano
  );
  return datasets.point?.map((point) => {
    return {
      time: point.endTimeNanos!,
      value: point.value![0].fpVal!,
    };
  });
}
