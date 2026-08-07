export interface Website {
  id: string;
  chatId: string;
  ownerId: string;
  title: string;
  prompt?: string;
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  version: number;
  isPublished: boolean;
  appName: 'VELRYA AI';
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteVersion {
  version: number;
  htmlCode: string;
  createdAt: string;
}

export const createNewWebsite = (ownerId: string, chatId: string): Partial<Website> => ({
  ownerId,
  chatId,
  title: 'New Website - VELRYA AI',
  version: 1,
  isPublished: false,
  appName: 'VELRYA AI',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
