import { RichTextField } from '@payloadcms/richtext-lexical/client'
import { LexicalDiffComponent } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalCell } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField } from '@payloadcms/richtext-lexical/rsc'

export const importMap = {
  '@payloadcms/richtext-lexical/client#RichTextField': RichTextField,
  '@payloadcms/richtext-lexical/rsc#LexicalDiffComponent': LexicalDiffComponent,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell': RscEntryLexicalCell,
  '@payloadcms/richtext-lexical/rsc#RscEntryLexicalField': RscEntryLexicalField,
}
