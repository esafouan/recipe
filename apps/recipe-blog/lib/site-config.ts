import siteConfig from '@/config/site-config.json'

export function getSiteConfig() {
  return siteConfig
}

export function getAboutPageData() {
  return siteConfig.pages.about
}

export function getChefData() {
  return siteConfig.pages.about.chef
}

export function getContactPageData() {
  return siteConfig.pages.contact
}

export function getSocialSharingConfig() {
  return siteConfig.socialSharing
}
