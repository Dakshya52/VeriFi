from transformers import pipeline

classifier = pipeline("text-classification", model="dhruvpal/fake-news-bert", device=0)  # Use device=0 for GPU acceleration

text = "BJP candidate Parvesh Saheb Singh Verma wins New Delhi Assembly constituency by defeating AAP Convenor and former CM Arvind Kejriwal. "
result = classifier(text)

print(result)