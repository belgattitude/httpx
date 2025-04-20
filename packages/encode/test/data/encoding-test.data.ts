const data = {
  asciiString: 'Hello, world!',
  japaneseString: 'こんにちは世界',
  frenchString: 'Bonjour le monde ! Éàèçêëîïôûù',
  germanString: 'Hallo Welt! ÄÖÜäöüß',
  emojiString: '🌸😊🚀🔥💧🌍🌟🎉🍕🎶❤️😂👍',
  urlUnsafeString: "?=:@&$+!#'()~*%/;:<>\\",
};

export const getEncodingTestData = (): string => {
  return [
    data.asciiString,
    data.frenchString,
    data.germanString,
    data.emojiString,
    data.japaneseString,
    data.urlUnsafeString,
  ].join('');
};
