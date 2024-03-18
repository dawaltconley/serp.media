import type { AstroSeoProps, ImagePrevSize } from '@astrolib/seo';
import { I18N } from '~/utils/config';

const formatter: Intl.DateTimeFormat =
  I18N?.dateFormatter ||
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

export const getFormattedDate = (date: Date): string => (date ? formatter.format(date) : '');

export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

// Function to format a number in thousands (K) or millions (M) format depending on its value
export const toUiAmount = (amount: number) => {
  if (!amount) return 0;

  let value: string;

  if (amount >= 1000000000) {
    const formattedNumber = (amount / 1000000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'B';
    } else {
      value = formattedNumber + 'B';
    }
  } else if (amount >= 1000000) {
    const formattedNumber = (amount / 1000000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'M';
    } else {
      value = formattedNumber + 'M';
    }
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    if (Number(formattedNumber) === parseInt(formattedNumber)) {
      value = parseInt(formattedNumber) + 'K';
    } else {
      value = formattedNumber + 'K';
    }
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};

const isImagePrevSize = (str: string): str is ImagePrevSize => str === 'none' || str === 'standard' || str === 'large';

export type MetaRobots = Pick<AstroSeoProps, 'noindex' | 'nofollow' | 'robotsProps'>;

export function parseMetaRobots(robotsString: string): MetaRobots {
  const fields = robotsString.split(/\s*,\s*/);

  const none = fields.includes('none');
  const maxSnippet = Number(fields.find((f) => f.startsWith('max-snippet'))?.split(':')?.[1]);
  const maxImagePreview = fields.find((f) => f.startsWith('max-image-preview'))?.split(':')?.[1];
  const maxVideoPreview = Number(fields.find((f) => f.startsWith('max-video-preview'))?.split(':')?.[1]);
  const unavailableAfter = fields.find((f) => f.startsWith('unavailable_after'))?.split(':')?.[1];

  const parsed: MetaRobots = {
    noindex: fields.includes('noindex') || none, // default to index
    nofollow: fields.includes('nofollow') || none, // default to follow
    robotsProps: {
      nosnippet: fields.includes('nosnippet'),
      maxSnippet: !Number.isNaN(maxSnippet) ? maxSnippet : undefined,
      maxImagePreview: maxImagePreview && isImagePrevSize(maxImagePreview) ? maxImagePreview : undefined,
      maxVideoPreview: !Number.isNaN(maxVideoPreview) ? maxVideoPreview : undefined, // not implemented yet in astrolib/seo... but keeping this in case it is later
      noarchive: fields.includes('noarchive'),
      unavailableAfter,
      noimageindex: fields.includes('noimageindex'),
      notranslate: fields.includes('notranslate'),
    },
  };

  return parsed;
}

// export function parseMetaRobots(robotsString: string): MetaRobots {
//   return (
//     robotsString.split(/\s*,\s*/).reduce<MetaRobots>((parsed, field) => {
//       if (field === 'index') parsed.noindex = false;
//       if (field === 'noindex') parsed.noindex = true;
//       if (field === 'follow') parsed.nofollow = false;
//       if (field === 'nofollow') parsed.nofollow = true;
//       if (field === 'none') {
//         parsed.noindex = true;
//         parsed.nofollow = true;
//       }
//
//       const { robotsProps = {} } = parsed;
//       if (field === 'nosnippet') robotsProps.nosnippet = true;
//       if (field === 'noarchive') robotsProps.noarchive = true;
//       if (field === 'noimageindex') robotsProps.noimageindex = true;
//       if (field === 'notranslate') robotsProps.notranslate = true;
//       if (field.startsWith('max-snippet')) {
//         const value = Number(field.split(':')[1]);
//         robotsProps.maxSnippet = !Number.isNaN(value) ? value : undefined;
//       }
//       if (field.startsWith('max-image-preview')) {
//         const value = field.split(':')[1];
//         robotsProps.maxImagePreview = isImagePrevSize(value) ? value : undefined;
//       }
//       if (field.startsWith('max-video-preview')) {
//         const value = Number(field.split(':')[1]);
//         robotsProps.maxVideoPreview = !Number.isNaN(value) ? value : undefined;
//       }
//       if (field.startsWith('unavailable_after')) {
//         robotsProps.unavailableAfter = field.split(':')[1] || undefined;
//       }
//       return { ...parsed, robotsProps };
//     }, {}) || {}
//   );
// }
