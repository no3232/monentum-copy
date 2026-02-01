#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const clear = () => {
  console.clear();
};

const printHeader = () => {
  console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║                                            ║'));
  console.log(chalk.bold.cyan('║     Moment Extension Setup Wizard ✨      ║'));
  console.log(chalk.bold.cyan('║                                            ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════╝\n'));
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function welcome() {
  clear();
  printHeader();

  console.log(chalk.white('이 스크립트는 Moment Chrome Extension을 설정하는 과정을 안내합니다.\n'));
  console.log(chalk.gray('다음 단계들을 진행합니다:'));
  console.log(chalk.gray('  1. Google Cloud Console 설정'));
  console.log(chalk.gray('  2. Unsplash API 설정'));
  console.log(chalk.gray('  3. 환경변수 파일 생성'));
  console.log(chalk.gray('  4. 프로젝트 빌드 및 Chrome 확장프로그램 등록\n'));

  const { ready } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'ready',
      message: '시작하시겠습니까?',
      default: true,
    },
  ]);

  if (!ready) {
    console.log(chalk.yellow('\n설정을 취소했습니다. 나중에 다시 실행해주세요.\n'));
    process.exit(0);
  }
}

async function setupGoogleCloudProject() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('📋 Step 1: Google Cloud Console 프로젝트 생성\n'));
  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. https://console.cloud.google.com 접속'));
  console.log(chalk.gray('2. 상단 프로젝트 선택 → "새 프로젝트" 클릭'));
  console.log(chalk.gray('3. 프로젝트 이름 입력 (예: "Moment Extension") → "만들기"\n'));

  const { completed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'completed',
      message: '프로젝트를 생성했습니까?',
      default: false,
    },
  ]);

  if (!completed) {
    console.log(chalk.red('\n⚠️  경고: 프로젝트가 생성되지 않으면 다음 단계에서 오류가 발생할 수 있습니다.'));
    await wait(2000);
  }
}

async function setupTasksAPI() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🔌 Step 2: Google Tasks API 활성화\n'));
  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. 좌측 메뉴 "API 및 서비스" → "라이브러리"'));
  console.log(chalk.gray('2. 검색창에 "Google Tasks API" 입력'));
  console.log(chalk.gray('3. "Google Tasks API" 선택 → "사용" 클릭\n'));

  const { completed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'completed',
      message: 'Google Tasks API를 활성화했습니까?',
      default: false,
    },
  ]);

  if (!completed) {
    console.log(chalk.red('\n⚠️  경고: API가 활성화되지 않으면 Tasks 기능이 작동하지 않습니다.'));
    await wait(2000);
  }
}

async function setupOAuthConsent() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🔐 Step 3: OAuth 동의 화면 설정\n'));
  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. "API 및 서비스" → "OAuth 동의 화면"'));
  console.log(chalk.gray('2. User Type: "외부" 선택 → "만들기"'));
  console.log(chalk.gray('3. 앱 정보 입력:'));
  console.log(chalk.gray('   - 앱 이름: Moment'));
  console.log(chalk.gray('   - 사용자 지원 이메일: 본인 이메일'));
  console.log(chalk.gray('   - 개발자 연락처 이메일: 본인 이메일'));
  console.log(chalk.gray('4. "저장 후 계속"'));
  console.log(chalk.gray('5. 범위 추가 → "범위 추가 또는 삭제"'));
  console.log(chalk.gray('   - "https://www.googleapis.com/auth/tasks" 선택'));
  console.log(chalk.gray('6. "저장 후 계속"'));
  console.log(chalk.gray('7. 테스트 사용자 → "ADD USERS" → 본인 Gmail 추가'));
  console.log(chalk.gray('8. "저장 후 계속" → "대시보드로 돌아가기"\n'));

  const { completed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'completed',
      message: 'OAuth 동의 화면을 설정했습니까?',
      default: false,
    },
  ]);

  if (!completed) {
    console.log(chalk.red('\n⚠️  경고: OAuth 동의 화면이 설정되지 않으면 로그인이 작동하지 않습니다.'));
    await wait(2000);
  }
}

async function setupOAuthClient() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🔑 Step 4: OAuth 클라이언트 ID 생성\n'));
  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. "API 및 서비스" → "사용자 인증 정보"'));
  console.log(chalk.gray('2. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"'));
  console.log(chalk.gray('3. 애플리케이션 유형: "Chrome 앱" 선택'));
  console.log(chalk.gray('4. 이름: "Moment Extension"'));
  console.log(chalk.gray('5. 애플리케이션 ID는 나중에 입력 (일단 빈 칸으로 두고 "만들기")'));
  console.log(chalk.gray('6. 생성된 클라이언트 ID를 복사\n'));

  const { clientId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'clientId',
      message: 'Google OAuth Client ID를 입력하세요:',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '클라이언트 ID를 입력해주세요.';
        }
        if (!input.includes('.apps.googleusercontent.com')) {
          return '올바른 형식의 클라이언트 ID가 아닙니다. (.apps.googleusercontent.com으로 끝나야 합니다)';
        }
        return true;
      },
    },
  ]);

  return clientId.trim();
}

async function setupUnsplash() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🖼️  Step 5: Unsplash API 설정\n'));
  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. https://unsplash.com/developers 접속 및 로그인'));
  console.log(chalk.gray('2. "Your apps" → "New Application" 클릭'));
  console.log(chalk.gray('3. 약관 동의 후 앱 정보 입력:'));
  console.log(chalk.gray('   - Application name: Moment'));
  console.log(chalk.gray('   - Description: New tab extension with Unsplash backgrounds'));
  console.log(chalk.gray('4. "Create application"'));
  console.log(chalk.gray('5. Access Key 복사\n'));

  const { accessKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'accessKey',
      message: 'Unsplash Access Key를 입력하세요:',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Access Key를 입력해주세요.';
        }
        return true;
      },
    },
  ]);

  return accessKey.trim();
}

async function createEnvFile(clientId, unsplashKey) {
  clear();
  printHeader();

  const spinner = ora('환경변수 파일 생성 중...').start();
  await wait(500);

  const envContent = `# Google OAuth 2.0 Client ID
# https://console.cloud.google.com/apis/credentials 에서 생성
VITE_GOOGLE_CLIENT_ID=${clientId}

# Unsplash Access Key
# https://unsplash.com/developers 에서 생성
VITE_UNSPLASH_ACCESS_KEY=${unsplashKey}
`;

  const envPath = path.join(rootDir, '.env');
  fs.writeFileSync(envPath, envContent, 'utf-8');

  spinner.succeed(chalk.green('.env 파일이 성공적으로 생성되었습니다!'));
  await wait(1000);
}

async function buildProject() {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🔨 Step 6: 프로젝트 빌드\n'));

  const { shouldBuild } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldBuild',
      message: '지금 프로젝트를 빌드하시겠습니까?',
      default: true,
    },
  ]);

  if (shouldBuild) {
    const spinner = ora('프로젝트 빌드 중...').start();

    try {
      execSync('npm run build', {
        cwd: rootDir,
        stdio: 'pipe'
      });
      spinner.succeed(chalk.green('프로젝트 빌드가 완료되었습니다!'));
      await wait(1000);
      return true;
    } catch (error) {
      spinner.fail(chalk.red('빌드에 실패했습니다.'));
      console.log(chalk.red('\n오류 내용:'));
      console.log(chalk.gray(error.message));
      await wait(2000);
      return false;
    }
  }

  return false;
}

async function chromeExtensionInstructions(built) {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🌐 Step 7: Chrome 확장프로그램 등록\n'));

  if (!built) {
    console.log(chalk.yellow('⚠️  먼저 프로젝트를 빌드해주세요: npm run build\n'));
  }

  console.log(chalk.white('다음 단계를 완료해주세요:\n'));
  console.log(chalk.gray('1. Chrome 브라우저에서 chrome://extensions 접속'));
  console.log(chalk.gray('2. 우측 상단 "개발자 모드" 활성화'));
  console.log(chalk.gray('3. "압축해제된 확장 프로그램을 로드합니다" 클릭'));
  console.log(chalk.gray('4. "extension" 폴더 선택'));
  console.log(chalk.gray('5. 로드된 확장프로그램의 ID를 복사 (예: abcdefgh...)'));
  console.log(chalk.red('\n⚠️  이 ID를 다음 단계에서 사용합니다!\n'));

  const { extensionId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'extensionId',
      message: 'Chrome 확장프로그램 ID를 입력하세요:',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return '확장프로그램 ID를 입력해주세요.';
        }
        return true;
      },
    },
  ]);

  return extensionId.trim();
}

async function finalOAuthUpdate(extensionId) {
  clear();
  printHeader();

  console.log(chalk.bold.yellow('🔄 Step 8: OAuth 클라이언트에 확장프로그램 ID 등록\n'));
  console.log(chalk.white('마지막 단계입니다! 다음을 완료해주세요:\n'));
  console.log(chalk.gray('1. Google Cloud Console → "사용자 인증 정보"'));
  console.log(chalk.gray('2. "승인된 리디렉션 URI" 섹션에서 "URI 추가" 클릭'));
  console.log(chalk.gray('3. 다음 리다이렉트 URI 입력 (마지막 슬래시 포함):'));
  console.log(chalk.cyan(`   https://${extensionId}.chromiumapp.org/`));
  console.log(chalk.gray('4. "저장" 클릭\n'));

  const { completed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'completed',
      message: 'OAuth 클라이언트를 업데이트했습니까?',
      default: false,
    },
  ]);

  if (!completed) {
    console.log(chalk.red('\n⚠️  경고: 이 단계를 완료하지 않으면 Google 로그인이 작동하지 않습니다!'));
    await wait(2000);
  }
}

async function complete() {
  clear();
  printHeader();

  console.log(chalk.bold.green('🎉 설정이 완료되었습니다!\n'));
  console.log(chalk.white('이제 다음을 확인해보세요:\n'));
  console.log(chalk.gray('1. Chrome에서 새 탭 열기'));
  console.log(chalk.gray('2. Google 로그인 버튼 클릭'));
  console.log(chalk.gray('3. Tasks 연동 확인'));
  console.log(chalk.gray('4. Unsplash 배경 이미지 로드 확인\n'));

  console.log(chalk.cyan('개발 모드로 실행하려면:'));
  console.log(chalk.white('  npm run dev\n'));

  console.log(chalk.cyan('문제가 발생하면:'));
  console.log(chalk.white('  README.md의 상세 가이드를 참고하세요.\n'));

  console.log(chalk.bold.magenta('Happy coding! ✨\n'));
}

async function main() {
  try {
    await welcome();
    await setupGoogleCloudProject();
    await setupTasksAPI();
    await setupOAuthConsent();
    const clientId = await setupOAuthClient();
    const unsplashKey = await setupUnsplash();
    await createEnvFile(clientId, unsplashKey);
    const built = await buildProject();
    const extensionId = await chromeExtensionInstructions(built);
    await finalOAuthUpdate(extensionId);
    await complete();
  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.red('\n터미널 환경에서 실행할 수 없습니다.'));
    } else {
      console.log(chalk.red('\n오류가 발생했습니다:'), error.message);
    }
    process.exit(1);
  }
}

main();
