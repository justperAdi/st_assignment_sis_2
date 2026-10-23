export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** New user with a unique email on every call, so runs never collide. */
export function newUser(): User {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'Sis',
    lastName: 'Tester',
    email: `sis2.${id}@example.com`,
    password: `Sis2!Kbtu${id}`,
  };
}
