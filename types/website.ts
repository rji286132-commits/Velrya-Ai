export interface Website {
  id: string;
  chatId: string;
  ownerId: string;
  title: string;
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  version: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}