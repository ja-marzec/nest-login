import { Injectable } from '@nestjs/common';

export interface User {
    id: number,
	username: string,
    password: string
} ;

@Injectable()
export class UsersService {
	// Should be placed id DB with hashed passwords
	private readonly users : Array<User>= [
		{
			id: 1,
			username: '1',
			password: '1'
		},
		{
			id: 2,
			username: '2',
			password: '2'
		}
	];

	async findOne(username: string): Promise<User | undefined> {
		return this.users.find((user) => user.username === username);
	}
}
