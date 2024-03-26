import { renderFile } from 'template-file';

export const renderTemplate = async (template: string, data: any) => {
  return renderFile(template, data);
};
