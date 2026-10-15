import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { termSchema } from './lib/schema.ts';

export const collections = {
  // 용어 1개 = 파일 1개. 파일 이름이 id이고 URL(/terms/<id>/)이 된다.
  // 준비 중 용어(stubs.json)와 사다리(ladders.json)는 순서가 중요한 목록이라 컬렉션이 아니라 lib/handbook.ts에서 읽는다.
  terms: defineCollection({
    loader: glob({
      pattern: '*.json',
      base: './src/content/terms',
      // 기본값은 파일 이름을 slug로 바꿔 버려서, 대문자나 밑줄이 섞인 이름을 검사에서 놓친다.
      generateId: ({ entry }) => entry.replace(/\.json$/, ''),
    }),
    schema: termSchema,
  }),
};
