import MarkdownIt from "markdown-it/lib";
import annotations from "./plugins/annotations";
import frontmatter from "./plugins/frontmatter";
import comments from "./plugins/comments";
import type Token from "markdown-it/lib/token";

export default class Tokenizer {
	private parser: MarkdownIt;

	constructor(config: TokenizerOptions = {}) {
		this.parser = new MarkdownIt(config);
		this.parser.use(annotations, "annotations", {});
		this.parser.use(frontmatter, "frontmatter", {});
		this.parser.disable([
			"lheading",
			// Disable indented `code_block` support https://spec.commonmark.org/0.30/#indented-code-block
			"code",
		]);

		if (config.allowComments) this.parser.use(comments, "comments", {});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	use(plugin: MarkdownItPlugin, args: any) {
		this.parser = this.parser.use(plugin, args);
	}

	tokenize(content: string): Token[] {
		return this.parser.parse(content.toString(), {});
	}
}

type MarkdownItPlugin =
	| MarkdownIt.PluginSimple
	| MarkdownIt.PluginWithOptions
	| MarkdownIt.PluginWithParams;

type TokenizerOptions = MarkdownIt.Options & {
	allowIndentation?: boolean;
	allowComments?: boolean;
};
