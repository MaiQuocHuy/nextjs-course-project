// Mock partners data
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    website: 'https://google.com'
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    website: 'https://microsoft.com'
  },
  {
    id: '3',
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    website: 'https://apple.com'
  },
  {
    id: '4',
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png',
    website: 'https://netflix.com'
  },
  {
    id: '5',
    name: 'Spotify',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    website: 'https://spotify.com'
  },
  {
    id: '6',
    name: 'Airbnb',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg',
    website: 'https://airbnb.com'
  },
  {
    id: '7',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    website: 'https://amazon.com'
  },
  {
    id: '8',
    name: 'Meta',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    website: 'https://meta.com'
  }
];

export const getFeaturedPartners = () => {
  return mockPartners.slice(0, 6);
};

export const getAllPartners = () => {
  return mockPartners;
};
