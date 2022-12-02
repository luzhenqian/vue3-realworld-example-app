import { instance } from "./request";

export type TagsRes = {
  tags: Tags;
};

export type Tags = string[];

export function getTags() {
  return instance.get<TagsRes>(`/tags`);
}
