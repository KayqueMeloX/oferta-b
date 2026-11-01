import type { Book, BookChapter } from "./types";
import { blueprintBook } from "./blueprint";
import { planBook } from "./plan";
import { sanctuaryBook } from "./sanctuary";
import { sealsBook } from "./seals";
import { wealthBook } from "./wealth";
import { altarBook } from "./altar";

export type { Book, BookChapter };

export const LIBRARY_BOOKS: Book[] = [
  blueprintBook,
  planBook,
  sanctuaryBook,
  sealsBook,
  wealthBook,
  altarBook,
];
