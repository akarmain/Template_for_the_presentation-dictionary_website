import json

with open("../public/baza.json", "r") as f:
    data = json.load(f)

duplicates = []
seen = {}

# Going through all the dictionaries in the data
for key, value in data.items():
# Going through all the words and their slide numbers in each dictionary
    for word, slides in value["crumbers_words"].items():
        # Going through all the slide numbers for each word
        for slide in slides:
            key = f"{word}:{slide}"
            if key in seen:
                duplicates.append((word, slide))
            else:
                seen[key] = True

if len(duplicates) > 0:
    print("Duplicate elements (Повторяющиеся элементы)")
    for word, slide in duplicates:
        print(f"{word}, слайд {slide}")
else:
    print("No duplicate elements (Нет повторяющихся элементов)")
