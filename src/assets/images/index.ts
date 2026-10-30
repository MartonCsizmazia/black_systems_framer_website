// Every image the site uses: import it here, then reference it as images.<name>.
// Components set the alt text themselves where it depends on the language;
// `alt` here is only the fallback.

import logoAccentureSrc from './accenture.svg'
import logoClarioSrc from './clario.svg'
import logoBudapestSrc from './budapest-logo.svg'
import logoDeutscheTelekomSrc from './deutsche-telekom.svg'
import logoVoormediaSrc from './voormedia.svg'
import blackSystemsLogoStackedSrc from './black-systems-thin-stacked-white.png'
import blackSystemsLogoOneLineSrc from './black-systems-thinner-oneline-white.png'
import heroVideoSrc from './mountain_contrail_30s_8.mp4'
import heroVideoMobileSrc from './mountain_contrail_mobile.mp4'
import founderPortraitSrc from './laptop-red-studio.avif'
import founderAvatarSrc from './cta-avatar-wfrjn1.avif'
import ctaBackgroundSrc from './villa-g891sp.avif'
import ctaPortraitSrc from './portrait-blue-warmer.avif'
import contactPortraitSrc from './standing-orange-studio.avif'
import leadCaptureSrc from './lead-capture-bakery-summer-358x512.avif'
import manualWorkSrc from './manual-work-automation-woman-358x512.avif'
import auditCustomSrc from './audit-custom-shipwright-358x512.avif'
import residenceGoldenHourSrc from './residence-golden-hour-512x358.avif'
import officeResumeReviewSrc from './resume-review-studio-512x358.avif'
import hotelLobbyReceptionSrc from './hotel-lobby-studio-512x358.avif'
import officeSunsetSigningSrc from './sunlit-office-studio-512x358.avif'

export const images = {
  // Past employers (the logo strip in About).
  logoAccenture: { src: logoAccentureSrc, alt: '' },
  logoClario: { src: logoClarioSrc, alt: '' },
  logoBudapest: { src: logoBudapestSrc, alt: '' },
  logoDeutscheTelekom: { src: logoDeutscheTelekomSrc, alt: '' },
  logoVoormedia: { src: logoVoormediaSrc, alt: '' },
  // Brand.
  blackSystemsLogoStacked: { src: blackSystemsLogoStackedSrc, alt: 'Black Systems' },
  blackSystemsLogoOneLine: { src: blackSystemsLogoOneLineSrc, alt: 'Black Systems' },
  // Hero background (desktop and phone versions).
  heroVideo: { src: heroVideoSrc, alt: '' },
  heroVideoMobile: { src: heroVideoMobileSrc, alt: '' },
  // Founder photos: About portrait, navbar "Meet the CEO" card, CTA banner, Contact.
  founderPortrait: { src: founderPortraitSrc, alt: '' },
  founderAvatar: { src: founderAvatarSrc, alt: '' },
  ctaBackground: { src: ctaBackgroundSrc, alt: '' },
  ctaPortrait: { src: ctaPortraitSrc, alt: '' },
  contactPortrait: { src: contactPortraitSrc, alt: '' },
  // Thumbnail on the home page's "See all" case studies link.
  // Service cards.
  leadCapture: { src: leadCaptureSrc, alt: '' },
  manualWork: { src: manualWorkSrc, alt: '' },
  auditCustom: { src: auditCustomSrc, alt: '' },
  // Case study covers.
  residenceGoldenHour: { src: residenceGoldenHourSrc, alt: 'Residence at golden hour' },
  officeResumeReview: { src: officeResumeReviewSrc, alt: 'Reviewing a resume in an office' },
  hotelLobbyReception: { src: hotelLobbyReceptionSrc, alt: 'Hotel lobby reception desk' },
  officeSunsetSigning: { src: officeSunsetSigningSrc, alt: 'Signing documents in an office at sunset' },
} as const
