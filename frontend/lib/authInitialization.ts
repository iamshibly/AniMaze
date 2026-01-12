// src/lib/authInitialization.ts - Initialize all demo accounts
import { AuthService } from './auth';

// Direct access to AuthStorage for admin creation
const createAdminUserDirectly = (userData: {
  name: string;
  email: string;
  password: string;
  avatar_id: number;
}) => {
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
  const hashPassword = (password: string) => btoa(password + 'salt').split('').reverse().join('');
  
  const adminUser = {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name,
    avatar_id: userData.avatar_id,
    avatar_url: `/avatars/avatar-${userData.avatar_id}.png`,
    role: 'admin' as const,
    is_premium: true,
    premium_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    xp: 10000,
    level: 50,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
    password: hashPassword(userData.password)
  };

  // Access localStorage directly for admin users
  const usersKey = 'anime_quiz_users';
  try {
    const storedUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');
    
    // Check if admin already exists
    if (storedUsers.find((user: any) => user.email === userData.email)) {
      return { user: null, error: { message: 'User already exists' } };
    }
    
    storedUsers.push(adminUser);
    localStorage.setItem(usersKey, JSON.stringify(storedUsers));
    
    const { password, ...userWithoutPassword } = adminUser;
    return { user: userWithoutPassword, error: null };
  } catch (error) {
    return { user: null, error: { message: 'Failed to create admin user' } };
  }
};

export const initializeDemoAccounts = async () => {
  console.log('🔧 Initializing demo accounts...');

  // Check if demo accounts already exist
  const allUsers = AuthService.getAllUsers();
  const existingEmails = allUsers.map(user => user.email);

  const demoAccounts = [
    {
      name: 'Administrator',
      email: 'admin@animequiz.com',
      password: 'admin123',
      role: 'admin' as const,
      avatar_id: 1
    },
    {
      name: 'Demo User',
      email: 'demo@user.com',
      password: 'demo123',
      role: 'user' as const,
      avatar_id: 2
    },
    {
      name: 'Demo Critique',
      email: 'critique@demo.com',
      password: 'critique123',
      role: 'critique' as const,
      avatar_id: 3
    },
    // Additional admin accounts for different roles
    {
      name: 'Content Manager',
      email: 'content@banglaanimeverse.com',
      password: 'content123',
      role: 'admin' as const,
      avatar_id: 4
    },
    {
      name: 'Moderator',
      email: 'mod@banglaanimeverse.com',
      password: 'mod123',
      role: 'admin' as const,
      avatar_id: 5
    },
  ];

  let createdCount = 0;

  for (const account of demoAccounts) {
    if (!existingEmails.includes(account.email)) {
      try {
        let result;
        
        // Use different methods for admin vs regular users
        if (account.role === 'admin') {
          result = createAdminUserDirectly({
            name: account.name,
            email: account.email,
            password: account.password,
            avatar_id: account.avatar_id
          });
        } else {
          result = await AuthService.signUp({
            name: account.name,
            email: account.email,
            password: account.password,
            role: account.role,
            avatar_id: account.avatar_id
          });
        }

        if (result.user) {
          console.log(`✅ Created demo ${account.role}: ${account.email}`);
          createdCount++;
        } else if (result.error) {
          console.warn(`⚠️ Failed to create ${account.email}:`, result.error.message);
        }
      } catch (error) {
        console.error(`❌ Error creating ${account.email}:`, error);
      }
    } else {
      console.log(`ℹ️ Demo account already exists: ${account.email}`);
    }
  }

  if (createdCount > 0) {
    console.log(`🎉 Created ${createdCount} new demo accounts`);
  }

  console.log(`📊 Total users in system: ${AuthService.getAllUsers().length}`);
  
  return {
    created: createdCount,
    total: AuthService.getAllUsers().length,
    accounts: demoAccounts.map(acc => ({ email: acc.email, role: acc.role }))
  };
};

// Call this function when the app starts
export const initializeAuthentication = () => {
  // Initialize the auth service first
  AuthService.initialize();
  
  // Then create demo accounts
  return initializeDemoAccounts();
};