// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /analysis/interface/invoke/top */
export async function listInterfaceInvokeTop(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInterfaceInfoAnalysisVO>('/analysis/interface/invoke/top', {
    method: 'GET',
    ...(options || {}),
  });
}
