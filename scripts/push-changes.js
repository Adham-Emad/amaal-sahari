const { execSync } = require('child_process');

try {
  console.log('Configuring git...');
  execSync('git config --global user.email "v0@vercel.com"', { cwd: process.cwd() });
  execSync('git config --global user.name "v0"', { cwd: process.cwd() });

  console.log('Checking git status...');
  const status = execSync('git status', { cwd: process.cwd(), encoding: 'utf-8' });
  console.log(status);

  console.log('Adding all changes...');
  execSync('git add .', { cwd: process.cwd(), stdio: 'inherit' });

  console.log('Committing changes...');
  execSync('git commit -m "feat: add logo to navbar and footer, fix admin link removal, add updateContact function"', { cwd: process.cwd(), stdio: 'inherit' });

  console.log('Pushing to GitHub...');
  execSync('git push origin add-logo-to-website', { cwd: process.cwd(), stdio: 'inherit' });

  console.log('✅ Changes pushed successfully to add-logo-to-website branch!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
