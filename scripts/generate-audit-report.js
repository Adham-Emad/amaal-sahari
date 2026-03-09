const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 55, right: 55 },
  info: {
    Title: 'Amaal Sahari Website - Security & Quality Audit Report',
    Author: 'Technical Audit Team',
    Subject: 'Website Issues Report',
  }
});

const output = fs.createWriteStream(path.join(process.cwd(), 'Amaal_Sahari_Audit_Report.pdf'));
doc.pipe(output);

const colors = {
  primary: '#1a1a2e',
  accent: '#0f3460',
  critical: '#c0392b',
  criticalBg: '#fdf0ef',
  major: '#e67e22',
  majorBg: '#fef9f0',
  moderate: '#f39c12',
  moderateBg: '#fefcf0',
  minor: '#3498db',
  minorBg: '#f0f7fe',
  text: '#2c3e50',
  lightText: '#7f8c8d',
  line: '#bdc3c7',
  white: '#ffffff',
  bg: '#f8f9fa',
};

function drawHeader() {
  doc.rect(0, 0, doc.page.width, 140).fill(colors.primary);
  doc.rect(0, 140, doc.page.width, 5).fill(colors.accent);

  doc.fillColor(colors.white)
    .fontSize(28)
    .font('Helvetica-Bold')
    .text('WEBSITE AUDIT REPORT', 55, 40, { width: 485 });

  doc.fontSize(14)
    .font('Helvetica')
    .text('Amaal Sahari — Facility Management Website', 55, 78);

  doc.fontSize(10)
    .fillColor('#a0aec0')
    .text('Prepared: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 55, 105);

  doc.y = 170;
}

function drawSummaryBox() {
  const startY = doc.y;
  doc.rect(55, startY, 485, 115).fill(colors.bg).stroke(colors.line);

  doc.fillColor(colors.text).fontSize(14).font('Helvetica-Bold')
    .text('Summary', 70, startY + 15);

  doc.fontSize(10).font('Helvetica').fillColor(colors.text)
    .text('This report identifies issues discovered during a full audit of the Amaal Sahari website. Each issue is rated by severity so you can prioritize what to fix first.', 70, startY + 38, { width: 450 });

  const statsY = startY + 75;
  const stats = [
    { label: 'Critical', count: '5', color: colors.critical },
    { label: 'Major', count: '4', color: colors.major },
    { label: 'Moderate', count: '5', color: colors.moderate },
    { label: 'Minor', count: '4', color: colors.minor },
  ];

  let sx = 70;
  stats.forEach(s => {
    doc.rect(sx, statsY, 10, 10).fill(s.color);
    doc.fillColor(colors.text).fontSize(10).font('Helvetica-Bold')
      .text(s.count, sx + 15, statsY - 1, { continued: true })
      .font('Helvetica').text(' ' + s.label);
    sx += 115;
  });

  doc.y = startY + 130;
}

function sectionTitle(title) {
  if (doc.y > 680) doc.addPage();
  const y = doc.y + 10;
  doc.rect(55, y, 485, 28).fill(colors.primary);
  doc.fillColor(colors.white).fontSize(13).font('Helvetica-Bold')
    .text(title, 65, y + 7, { width: 465 });
  doc.y = y + 40;
}

function issueBlock(number, title, severity, severityColor, bgColor, impact, details, recommendation) {
  const contentHeight = 30 + 14 + (impact ? 28 : 0) + 14 + (details.length * 14) + 14 + 28 + 20;
  if (doc.y + contentHeight > 740) doc.addPage();

  const startY = doc.y;

  doc.rect(55, startY, 485, 26).fill(bgColor);
  doc.rect(55, startY, 4, 26).fill(severityColor);

  doc.rect(65, startY + 5, 50, 16).fillAndStroke(severityColor, severityColor);
  doc.fillColor(colors.white).fontSize(8).font('Helvetica-Bold')
    .text(severity, 67, startY + 9, { width: 46, align: 'center' });

  doc.fillColor(colors.text).fontSize(11).font('Helvetica-Bold')
    .text(number + '. ' + title, 122, startY + 7, { width: 408 });

  doc.y = startY + 32;

  if (impact) {
    doc.fillColor(colors.text).fontSize(9).font('Helvetica-Bold')
      .text('What this means: ', 65, doc.y, { continued: true })
      .font('Helvetica').fillColor(colors.lightText)
      .text(impact, { width: 460 });
    doc.y += 6;
  }

  doc.fillColor(colors.text).fontSize(9).font('Helvetica-Bold')
    .text('Details:', 65, doc.y);
  doc.y += 3;

  details.forEach(d => {
    if (doc.y > 740) doc.addPage();
    doc.fillColor(colors.lightText).fontSize(9).font('Helvetica')
      .text('•  ' + d, 75, doc.y, { width: 450, lineGap: 2 });
    doc.y += 4;
  });

  doc.y += 2;
  doc.fillColor(colors.text).fontSize(9).font('Helvetica-Bold')
    .text('Recommendation: ', 65, doc.y, { continued: true })
    .font('Helvetica').fillColor(colors.lightText)
    .text(recommendation, { width: 450 });

  doc.y += 16;

  doc.strokeColor(colors.line).lineWidth(0.5)
    .moveTo(55, doc.y).lineTo(540, doc.y).stroke();
  doc.y += 8;
}

drawHeader();
drawSummaryBox();

sectionTitle('CRITICAL — Immediate Attention Required');

issueBlock(
  '1',
  'Admin Pages Have No Real Security',
  'CRITICAL',
  colors.critical,
  colors.criticalBg,
  'Anyone on the internet can modify your website content, upload files, or delete data — without logging in. The login page only hides the admin panel visually but does not actually protect the data behind it.',
  [
    'The content editing API accepts changes from anyone, no login required.',
    'The file upload endpoint allows anyone to upload files to your server.',
    'An attacker could replace your website text, images, or inject harmful content.',
  ],
  'Add real server-side security so that only logged-in administrators can make changes.'
);

issueBlock(
  '2',
  'Default Admin Password Is Known',
  'CRITICAL',
  colors.critical,
  colors.criticalBg,
  'The admin password "amaal2024" is written directly in the website code. Anyone who views the code can see it and log into your admin panel.',
  [
    'The default password is visible in the source code that browsers download.',
    'Even if you changed the password, the default one is still visible in the code.',
    'Automated bots regularly scan websites for known default passwords.',
  ],
  'Remove the hardcoded password from the code and require a secure password to be set during first-time setup.'
);

issueBlock(
  '3',
  'Admin Password Stored Insecurely in Browser',
  'CRITICAL',
  colors.critical,
  colors.criticalBg,
  'After logging in, your password is saved in plain text inside the browser. Any malicious script or browser extension could read it.',
  [
    'The password is stored in the browser\'s localStorage, which is not secure.',
    'Third-party scripts (analytics, ads, etc.) running on the page can access it.',
    'If someone gains access to the browser, they immediately have the admin password.',
  ],
  'Use secure session tokens (cookies with proper security flags) instead of storing passwords in the browser.'
);

issueBlock(
  '4',
  'Password Reset Bypasses Email Verification',
  'CRITICAL',
  colors.critical,
  colors.criticalBg,
  'When email is not configured, the password reset system reveals the secret token directly, allowing anyone to reset the admin password without email access.',
  [
    'The reset token is returned in the API response when SMTP is not set up.',
    'An attacker can use this token to set a new admin password.',
    'This completely bypasses the email verification security step.',
  ],
  'Never expose reset tokens in API responses. Disable password reset when email is not configured.'
);

issueBlock(
  '5',
  'Diagnostic Pages Expose Server Details',
  'CRITICAL',
  colors.critical,
  colors.criticalBg,
  'Several publicly accessible pages reveal detailed information about your server — file paths, disk space, software versions, and email configuration. This information helps attackers plan attacks.',
  [
    'The /api/diagnose endpoint shows server paths, permissions, and disk usage.',
    'The /api/auth/smtp-diagnostic endpoint reveals email server configuration.',
    'The /api-health page provides a full diagnostic dashboard to anyone.',
    'These are essentially a map of your system for anyone who finds them.',
  ],
  'Remove these diagnostic endpoints entirely, or protect them behind admin authentication.'
);

sectionTitle('MAJOR — Broken Functionality');

issueBlock(
  '6',
  'All Website Images Are Missing',
  'MAJOR',
  colors.major,
  colors.majorBg,
  'None of the images on the website are loading. Visitors see broken image icons instead of your service photos, case studies, and branding images.',
  [
    'The image files folder (public/) does not exist on the server.',
    'Over 20 different images are referenced but none are available.',
    'This affects the homepage, services, case studies, and about pages.',
    'The website appears unprofessional and incomplete without images.',
  ],
  'Upload all required images to the server, or update the website to use images from an external storage service.'
);

issueBlock(
  '7',
  'Contact Form Does Not Send Messages',
  'MAJOR',
  colors.major,
  colors.majorBg,
  'When visitors fill out the contact form, their message is only saved in their own browser — it is never sent to you. You are not receiving any customer inquiries submitted through the website.',
  [
    'Form submissions are stored in the visitor\'s browser localStorage only.',
    'No email notification is sent to the business.',
    'No server-side storage of contact requests exists.',
    'You have likely been missing customer inquiries without knowing.',
  ],
  'Connect the contact form to a server-side API that sends email notifications and stores submissions securely.'
);

issueBlock(
  '8',
  'Admin Password Reset Is Broken',
  'MAJOR',
  colors.major,
  colors.majorBg,
  'The "reset password" feature in the admin panel does not work. It calls the wrong endpoint and always fails.',
  [
    'The reset function sends an empty current password, which the server rejects.',
    'Administrators cannot recover their password if forgotten through the admin panel.',
    'The system returns "Current and new passwords are required" every time.',
  ],
  'Fix the password reset to use the correct server endpoint designed for password resets.'
);

issueBlock(
  '9',
  'Cross-Origin Warning (Future Compatibility)',
  'MAJOR',
  colors.major,
  colors.majorBg,
  'Next.js is generating warnings about cross-origin requests. In a future update, this could prevent the website from loading properly.',
  [
    'The development server logs show cross-origin request warnings.',
    'A future Next.js version will require explicit configuration to allow this.',
    'Not addressing this now will cause problems when the framework is updated.',
  ],
  'Add the allowedDevOrigins configuration to the Next.js settings.'
);

doc.addPage();
sectionTitle('MODERATE — Should Be Fixed');

issueBlock(
  '10',
  'Website Domain Is Hardcoded',
  'MODERATE',
  colors.moderate,
  colors.moderateBg,
  'The website code contains the domain "amaalsahari.com" written directly in many places. This means search engines and social media previews may point to the wrong address if the domain changes.',
  [
    'SEO metadata, canonical URLs, and social sharing links all use the hardcoded domain.',
    'Google and other search engines will see conflicting information.',
    'If the site runs on a different domain (staging, Replit), SEO data will be wrong.',
  ],
  'Use environment variables for the domain so it can be easily changed per environment.'
);

issueBlock(
  '11',
  'Hardcoded WhatsApp Number',
  'MODERATE',
  colors.moderate,
  colors.moderateBg,
  'The footer contains a hardcoded fallback WhatsApp number that may not be correct.',
  [
    'The number +201021454545 is used as a fallback in the footer.',
    'If the admin-configured number fails to load, visitors will contact the wrong number.',
  ],
  'Remove the hardcoded fallback or make it configurable through the admin panel.'
);

issueBlock(
  '12',
  'Footer Links May Break When Services Change',
  'MODERATE',
  colors.moderate,
  colors.moderateBg,
  'The footer has links to specific services that are written directly in the code. If you rename or reorganize services in the admin panel, these links will break.',
  [
    'Service links in the footer are hardcoded, not dynamically generated.',
    'Changing service names in the admin panel won\'t update the footer.',
    'Visitors clicking broken footer links will see error pages.',
  ],
  'Generate footer service links dynamically from the admin content.'
);

issueBlock(
  '13',
  'Images Reload Every Time (Slow Performance)',
  'MODERATE',
  colors.moderate,
  colors.moderateBg,
  'The website forces all images to reload from scratch on every page visit, even if they haven\'t changed. This makes the site slower and uses more bandwidth for your visitors.',
  [
    'A timestamp is added to every image URL on each page load.',
    'This prevents browsers from caching images, causing repeated downloads.',
    'Visitors on slow connections will experience noticeably longer load times.',
  ],
  'Only bust the cache when images actually change, not on every page load.'
);

issueBlock(
  '14',
  'Unused Vercel Services Still Installed',
  'MODERATE',
  colors.moderate,
  colors.moderateBg,
  'The website still includes software packages for Vercel (the previous hosting provider). These add unnecessary weight and will not function on Replit.',
  [
    '@vercel/analytics and @vercel/blob packages are still in the project.',
    'These packages cannot connect to Vercel services from Replit.',
    'They add unnecessary code to your website bundle.',
  ],
  'Remove the Vercel-specific packages and replace with alternatives if needed.'
);

sectionTitle('MINOR — Low Priority Improvements');

issueBlock(
  '15',
  'Missing Placeholder Image',
  'MINOR',
  colors.minor,
  colors.minorBg,
  'A placeholder image used as a fallback in several places does not exist.',
  [
    'The file /placeholder.svg is referenced but missing.',
    'Components that fail to load images show a broken icon instead of a placeholder.',
  ],
  'Add a simple placeholder image to improve the appearance when content images are unavailable.'
);

issueBlock(
  '16',
  'Service Pages Don\'t Show Proper 404 Errors',
  'MINOR',
  colors.minor,
  colors.minorBg,
  'When someone visits a service page that doesn\'t exist, they see a basic inline message instead of the website\'s proper "page not found" design.',
  [
    'Service pages use custom inline error messages instead of the standard 404 page.',
    'This creates an inconsistent experience for visitors.',
    'Search engines may not properly identify these as missing pages.',
  ],
  'Use the built-in 404 page for missing services to improve consistency and SEO.'
);

issueBlock(
  '17',
  'Brief Language Flash for Arabic Users',
  'MINOR',
  colors.minor,
  colors.minorBg,
  'Arabic-speaking users may see the website briefly appear in English before switching to Arabic.',
  [
    'The language preference is loaded after the page renders.',
    'This causes a visible "flash" of English content for Arabic users.',
  ],
  'Load the language preference earlier in the page lifecycle to prevent the flash.'
);

issueBlock(
  '18',
  'Leftover Files from Previous Hosting',
  'MINOR',
  colors.minor,
  colors.minorBg,
  'The project contains over 30 documentation and script files from the previous Hostinger hosting setup that are no longer relevant.',
  [
    'Files like HOSTINGER_SETUP.md, upload-to-hostinger.php, and various guides remain.',
    'These add clutter and may cause confusion during future maintenance.',
  ],
  'Clean up unused documentation and hosting-specific files.'
);

doc.addPage();
sectionTitle('Recommended Action Plan');

const steps = [
  { phase: 'Phase 1 — Urgent (Security)', items: [
    'Fix all 5 critical security issues to prevent unauthorized access.',
    'Add proper server-side authentication to admin API endpoints.',
    'Remove diagnostic endpoints or protect them behind login.',
    'Remove hardcoded credentials from the codebase.',
  ]},
  { phase: 'Phase 2 — Essential (Functionality)', items: [
    'Upload or configure all missing images.',
    'Fix the contact form to actually deliver messages.',
    'Repair the admin password reset feature.',
    'Configure email (SMTP) settings for notifications.',
  ]},
  { phase: 'Phase 3 — Improvement (Quality)', items: [
    'Fix hardcoded URLs and make them configurable.',
    'Remove unused Vercel packages.',
    'Improve image caching for better performance.',
    'Clean up leftover files from previous hosting.',
  ]},
];

steps.forEach(step => {
  if (doc.y > 680) doc.addPage();
  doc.fillColor(colors.accent).fontSize(12).font('Helvetica-Bold')
    .text(step.phase, 65, doc.y + 5);
  doc.y += 8;
  step.items.forEach(item => {
    doc.fillColor(colors.text).fontSize(10).font('Helvetica')
      .text('→  ' + item, 80, doc.y, { width: 440, lineGap: 2 });
    doc.y += 4;
  });
  doc.y += 8;
});

doc.y += 15;
doc.strokeColor(colors.line).lineWidth(0.5)
  .moveTo(55, doc.y).lineTo(540, doc.y).stroke();
doc.y += 15;

doc.fillColor(colors.lightText).fontSize(9).font('Helvetica')
  .text('This report was generated as part of the Vercel-to-Replit migration audit. All issues listed above were identified through automated scanning and manual code review. No changes have been made — this document is for review purposes only.', 55, doc.y, { width: 485, align: 'center' });

doc.end();

output.on('finish', () => {
  console.log('PDF generated: Amaal_Sahari_Audit_Report.pdf');
});
