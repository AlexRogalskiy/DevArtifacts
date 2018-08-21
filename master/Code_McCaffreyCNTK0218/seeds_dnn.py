# seeds_dnn.py
# classify wheat seed variety

import numpy as np
import cntk as C

def create_reader(path, is_training, input_dim, output_dim):
  strm_x = C.io.StreamDef(field='properties',
    shape=input_dim, is_sparse=False)
  strm_y = C.io.StreamDef(field='variety',
    shape=output_dim, is_sparse=False)
  streams = C.io.StreamDefs(x_src=strm_x,
    y_src=strm_y)
  deserial = C.io.CTFDeserializer(path, streams)
  sweeps = C.io.INFINITELY_REPEAT if is_training else 1
  mb_source = C.io.MinibatchSource(deserial,
    randomize=is_training, max_sweeps=sweeps)
  return mb_source

def main():
  print("\nBegin wheat seed classification demo  \n")
  print("Using CNTK verson = " + str(C.__version__) + "\n")

  input_dim = 7
  hidden_dim = 4
  output_dim = 3

  train_file = ".\\Data\\seeds_train_data.txt"
  test_file = ".\\Data\\seeds_test_data.txt"
  
  # 1. create network and model
  X = C.ops.input_variable(input_dim, np.float32)
  Y = C.ops.input_variable(output_dim, np.float32)

  print("Creating a 7-(4-4-4)-3 tanh softmax NN for seed data ")
 
  with C.layers.default_options(init= \
    C.initializer.normal(scale=0.1, seed=2)):
    h1 = C.layers.Dense(hidden_dim, activation=C.ops.tanh,
      name='hidLayer1')(X)
    d1 = C.layers.Dropout(0.50, name="drop1")(h1)
    h2 = C.layers.Dense(hidden_dim, activation=C.ops.tanh,
      name='hidLayer2')(d1)
    h3 = C.layers.Dense(hidden_dim, activation=C.ops.tanh,
      name='hidLayer3')(h2)
    # oLayer = C.layers.Dense(output_dim, activation=C.ops.softmax, name='outLayer')(h3)
    oLayer = C.layers.Dense(output_dim, activation=None,
      name='outLayer')(h3)
  nnet = oLayer
  model = C.softmax(nnet)

  # with C.layers.default_options(init=C.initializer.uniform(scale=1.0, seed=1)): 
  #   net = C.layers.Sequential([
  #     C.layers.Dense(hidden_dim, activation=C.ops.tanh, name='hidLayer1'),
  #     C.layers.Dense(hidden_dim, activation=C.ops.tanh, name='hidLayer2'),
  #     C.layers.Dense(hidden_dim, activation=C.ops.tanh, name='hidLayer3'),
  #     # C.layers.Dropout(0.50),
  #     C.layers.Dense(output_dim, activation=None, name='outLayer') ])
  # nnet = net(X)
  # model = C.softmax(nnet)

  # 2. create learner and trainer
  print("Creating a cross entropy, SGD with LR=0.01, \
batch=10 Trainer \n")
  tr_loss = C.cross_entropy_with_softmax(nnet, Y)
  tr_clas = C.classification_error(nnet, Y)
 
  learn_rate = 0.01 
  learner = C.sgd(nnet.parameters, learn_rate)
  trainer = C.Trainer(nnet, (tr_loss, tr_clas), [learner])
  
  max_iter = 5000  # maximum training iterations
  batch_size = 10   # mini-batch size

  # 3. create data reader
  rdr = create_reader(train_file, True, input_dim,
    output_dim)
  my_input_map = {
    X : rdr.streams.x_src,
    Y : rdr.streams.y_src
  }

  # 4. train
  print("Starting training \n")
  for i in range(0, max_iter):
    curr_batch = rdr.next_minibatch(batch_size,
      input_map=my_input_map)
    trainer.train_minibatch(curr_batch)
    if i % 1000 == 0:
      mcee = trainer.previous_minibatch_loss_average
      pmea = trainer.previous_minibatch_evaluation_average
      macc = (1.0 - pmea) * 100
      print("batch %6d: mean loss = %0.4f, \
mean accuracy = %0.2f%% " % (i,mcee, macc))
      
  print("\nTraining complete")

  # 5. evaluate model on the test data
  print("\nEvaluating test data \n")

  rdr = create_reader(test_file, False, input_dim, output_dim)
  my_input_map = {
    X : rdr.streams.x_src,
    Y : rdr.streams.y_src
  }
  numTest = 60
  allTest = rdr.next_minibatch(numTest, input_map=my_input_map) 
  acc = (1.0 - trainer.test_minibatch(allTest)) * 100
  print("Classification accuracy on the \
60 test items = %0.2f%%" % acc)

  # examine
  # print("\nTrained model input-to-hidden weights: \n")
  # print(h1.hidLayer1.W.value)
  # note: object.object_name.W.value
  # print("\nTrained model hidden node biases: \n")
  # print(h1.hidLayer1.b.value)

  # (could save model here)

  # 6. use trained model to make prediction
  np.set_printoptions(precision = 4)
  unknown = np.array([[17.6, 15.9, 0.8, 6.2, 3.5, 4.1, 6.1]],
    dtype=np.float32) 
  print("\nPredicting variety for (non-normalized) seed features: ")
  print(unknown[0])
 
  raw_out = nnet.eval({X: unknown}) 
  print("\nRaw output values are: ")
  for i in range(len(raw_out[0])):
    print("%0.4f " % raw_out[0][i])

  pred_prob = model.eval({X: unknown}) 
  print("\nPrediction probabilities are: ")
  for i in range(len(pred_prob[0])):
    print("%0.4f " % pred_prob[0][i])

  print("\nEnd demo \n ") 

# main()
   
if __name__ == "__main__":
  main()
