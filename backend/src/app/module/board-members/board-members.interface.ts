export interface IAddBoardMemberPayload {
	userId?: string
	email?: string
	role?: 'EDITOR' | 'VIEWER'
}

export interface IUpdateBoardMemberPayload {
	role: 'EDITOR' | 'VIEWER'
}
