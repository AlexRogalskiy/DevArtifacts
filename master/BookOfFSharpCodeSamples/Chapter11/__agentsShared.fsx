module AgentsShared

type Agent<'T> = MailboxProcessor<'T>
type Message = | Message of obj
type ReplyMessage = | ReplyMessage of obj * AsyncReplyChannel<obj>
