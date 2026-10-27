import git from 'isomorphic-git';
import fs from 'fs';

async function commitAll() {
  const dir = '.';
  console.log('Calculating status matrix (excluding node_modules)...');
  
  const status = await git.statusMatrix({
    fs,
    dir,
    filter: f => !f.startsWith('node_modules') && !f.startsWith('.git') && !f.startsWith('dist') && !f.startsWith('.env')
  });

  console.log(`Found ${status.length} files to process.`);

  for (const [filepath, head, workdir, stage] of status) {
    if (workdir !== 0) {
      await git.add({ fs, dir, filepath });
    }
  }

  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: Pixelle Studio digital product e-commerce platform',
    author: {
      name: 'rabeyakterlima-design',
      email: 'rabeyakterlima-design@users.noreply.github.com'
    }
  });

  console.log('COMMIT SUCCESSFUL! SHA:', sha);
}

commitAll().catch(console.error);
