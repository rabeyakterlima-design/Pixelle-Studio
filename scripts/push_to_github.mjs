import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import fs from 'fs';

const token = process.argv[2] || process.env.GITHUB_TOKEN;
const username = 'rabeyakterlima-design';
const repoName = 'Pixelle-Studio';

if (!token) {
  console.error('Error: Please provide your GitHub Personal Access Token (PAT).');
  console.log('Usage: node scripts/push_to_github.mjs <YOUR_GITHUB_TOKEN>');
  process.exit(1);
}

async function main() {
  console.log(`Connecting to GitHub API as ${username}...`);

  // Step 1: Check if repository exists, if not, create it as Public
  const checkRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Pixelle-Studio-Uploader'
    }
  });

  if (checkRes.status === 404) {
    console.log(`Repository "${repoName}" does not exist yet. Creating public repository...`);
    const createRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Pixelle-Studio-Uploader',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Pixelle Studio — Digital Products for Creative Minds. Full-stack e-commerce with React, TypeScript & Supabase.',
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: true
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Failed to create repository: ${JSON.stringify(err)}`);
    }
    console.log(`✓ Public repository "${repoName}" created successfully!`);
  } else if (checkRes.ok) {
    console.log(`✓ Repository "${repoName}" found on GitHub.`);
  } else {
    const err = await checkRes.json();
    throw new Error(`GitHub API check error: ${JSON.stringify(err)}`);
  }

  // Step 2: Push commit to GitHub
  console.log('Pushing code to GitHub repository...');
  const remoteUrl = `https://github.com/${username}/${repoName}.git`;

  await git.push({
    fs,
    http,
    dir: '.',
    url: remoteUrl,
    ref: 'main',
    force: true,
    onAuth: () => ({
      username: token,
      password: ''
    })
  });

  console.log('====================================================');
  console.log(`✓ CODE PUSHED SUCCESSFULLY!`);
  console.log(`Repository URL: https://github.com/${username}/${repoName}`);
  console.log('====================================================');
}

main().catch(err => {
  console.error('Push failed:', err.message || err);
  process.exit(1);
});
