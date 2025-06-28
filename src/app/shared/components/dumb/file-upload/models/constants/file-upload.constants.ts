export const FileTypes: { [key: string]: string } = {
    EMPTY: '',
    IMAGE: 'image/*',
    VIDEO: 'video/*',
    AUDIO: 'audio/*',
    PDF: '.pdf',
    DOC: '.doc',
    DOCX: '.docx'
};

export const DeriverablesFileType = {
    VIDEO: 'Video',
    IMAGE: 'Image',
    PDF: 'PDF',
    LINK: 'Link',
  } as const;

  
  export const DefaultTips: { [key: string]: string[] } = {
    VIDEO: ['3 minutos o menos', 'Cumple con los requisitos descritos en Notion: https://www.notion.so/modak/Modak-Entrepreneurial-Resources-5f6d1addd1904f7b9b41424b1400c13d'],
    IMAGE: ['Cumple con los requisitos descritos en Notion:  https://www.notion.so/modak/Modak-Entrepreneurial-Resources-5f6d1addd1904f7b9b41424b1400c13d'],
    PDF: ['Cumple con los requisitos descritos en Notion:  https://www.notion.so/modak/Modak-Entrepreneurial-Resources-5f6d1addd1904f7b9b41424b1400c13d'],
    LINK: ['Cumple con los requisitos descritos en Notion:  https://www.notion.so/modak/Modak-Entrepreneurial-Resources-5f6d1addd1904f7b9b41424b1400c13d'],
  };

export const DefaultTipsTitle = "Requirements" ;