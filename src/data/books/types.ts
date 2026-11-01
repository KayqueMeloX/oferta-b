export interface BookChapter {
  title: string;
  scripture?: string;
  text: string[];
}

export interface Book {
  id: string;
  tag?: string;
  title: string;
  subtitle: string;
  cover: string;
  badge: string;
  badgeColor: string;
  pagesCount: number;
  chapters: BookChapter[];
}
