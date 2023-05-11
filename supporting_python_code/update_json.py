import json

filename = "../public/baza.json"

while True:
    name = input("Enter the main name (Введите главное имя) : ")
    if name.lower() == "end":
        break
    category = input("Enter a category (Введите категорию): ").title()
    number_slides = int(input("Enter the number of slides (Введите количество слайдов): "))
    extension = input("lead the pptx/ppt extension (Введите расширение pptx/ppt) : ")

    crumbers_words = {}
    while True:
        word = input("Enter the name of the word (Введите название слова): ").title()

        if word == "End":
            break

        try:
            start, end = input("Enter a range (Введите диапазон): ").split()
        except ValueError:
            print(
                "Error: The range must consist of two integers separated by a space\n(Ошибка: диапазон должен состоять из двух целых чисел, разделенных пробелом)")
            start, end = input("Enter a range (Введите диапазон): ").split()

        start, end = int(start), int(end)
        crumbers_words[word] = list(range(start, end+1))

    # создание словаря
    data = {
        name: {
            "category": category,
            "number_slides": number_slides,
            "extension": extension,
            "crumbers_words": crumbers_words
        }
    }
    with open(filename, "a") as file:
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        file.write(json_data)
        file.write("\n")
        
    print("The data has been successfully written to the file (Данные успешно записаны в файл)")
